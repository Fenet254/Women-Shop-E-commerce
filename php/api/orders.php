<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        handleGetOrders($db);
        break;
    case 'POST':
        handleCreateOrder($db);
        break;
    case 'PUT':
        handleUpdateOrderStatus($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetOrders($db) {
    try {
        $userId = $_GET['user_id'] ?? null;

        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            return;
        }

        $sql = "SELECT o.id, o.total_amount, o.status, o.shipping_address, o.payment_method, o.created_at, o.updated_at,
                       GROUP_CONCAT(CONCAT(oi.quantity, 'x ', p.name, ' ($', oi.price, ')') SEPARATOR '; ') as items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE o.user_id = ?
                GROUP BY o.id
                ORDER BY o.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll();

        echo json_encode(['success' => true, 'orders' => $orders]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch orders: ' . $e->getMessage()]);
    }
}

function handleCreateOrder($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['user_id']) || !isset($data['cart_items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and cart items are required']);
            return;
        }

        $userId = $data['user_id'];
        $cartItems = $data['cart_items'];
        $shippingAddress = $data['shipping_address'] ?? '';
        $paymentMethod = $data['payment_method'] ?? 'card';

        if (empty($cartItems)) {
            http_response_code(400);
            echo json_encode(['error' => 'Cart cannot be empty']);
            return;
        }

        $db->beginTransaction();

        // Calculate total and validate stock
        $totalAmount = 0;
        $validItems = [];

        foreach ($cartItems as $item) {
            $sql = "SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_active = 1";
            $stmt = $db->prepare($sql);
            $stmt->execute([$item['product_id']]);
            $product = $stmt->fetch();

            if (!$product) {
                $db->rollBack();
                http_response_code(400);
                echo json_encode(['error' => 'Product not found: ' . $item['product_id']]);
                return;
            }

            if ($product['stock_quantity'] < $item['quantity']) {
                $db->rollBack();
                http_response_code(400);
                echo json_encode(['error' => 'Insufficient stock for product: ' . $product['name']]);
                return;
            }

            $itemTotal = $product['price'] * $item['quantity'];
            $totalAmount += $itemTotal;
            $validItems[] = [
                'product_id' => $product['id'],
                'quantity' => $item['quantity'],
                'price' => $product['price'],
                'stock_quantity' => $product['stock_quantity']
            ];
        }

        // Create order
        $sql = "INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId, $totalAmount, $shippingAddress, $paymentMethod]);
        $orderId = $db->lastInsertId();

        // Add order items
        $sql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        foreach ($validItems as $item) {
            $stmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['price']]);

            // Update stock
            $newStock = $item['stock_quantity'] - $item['quantity'];
            $updateSql = "UPDATE products SET stock_quantity = ? WHERE id = ?";
            $updateStmt = $db->prepare($updateSql);
            $updateStmt->execute([$newStock, $item['product_id']]);
        }

        // Clear cart
        $sql = "DELETE FROM cart WHERE user_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId]);

        $db->commit();

        echo json_encode(['success' => true, 'order_id' => $orderId, 'total_amount' => $totalAmount]);
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create order: ' . $e->getMessage()]);
    }
}

function handleUpdateOrderStatus($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id || !$data || !isset($data['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Order ID and status are required']);
            return;
        }

        $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($data['status'], $validStatuses)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status']);
            return;
        }

        $sql = "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$data['status'], $id]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update order status: ' . $e->getMessage()]);
    }
}
?>
