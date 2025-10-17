<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        handleGetCart($db);
        break;
    case 'POST':
        handleAddToCart($db);
        break;
    case 'PUT':
        handleUpdateCartItem($db);
        break;
    case 'DELETE':
        handleRemoveFromCart($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetCart($db) {
    try {
        $userId = $_GET['user_id'] ?? null;

        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            return;
        }

        $sql = "SELECT c.id, c.quantity, c.added_at, p.id as product_id, p.name, p.price, p.image, p.stock_quantity
                FROM cart c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = ? AND p.is_active = 1
                ORDER BY c.added_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId]);
        $cartItems = $stmt->fetchAll();

        echo json_encode(['success' => true, 'cart' => $cartItems]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch cart: ' . $e->getMessage()]);
    }
}

function handleAddToCart($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['user_id']) || !isset($data['product_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and product ID are required']);
            return;
        }

        $userId = $data['user_id'];
        $productId = $data['product_id'];
        $quantity = $data['quantity'] ?? 1;

        // Check if product exists and has stock
        $sql = "SELECT stock_quantity FROM products WHERE id = ? AND is_active = 1";
        $stmt = $db->prepare($sql);
        $stmt->execute([$productId]);
        $product = $stmt->fetch();

        if (!$product) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }

        if ($product['stock_quantity'] < $quantity) {
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient stock']);
            return;
        }

        // Check if item already in cart
        $sql = "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId, $productId]);
        $existingItem = $stmt->fetch();

        if ($existingItem) {
            // Update quantity
            $newQuantity = $existingItem['quantity'] + $quantity;
            if ($newQuantity > $product['stock_quantity']) {
                http_response_code(400);
                echo json_encode(['error' => 'Insufficient stock for requested quantity']);
                return;
            }

            $sql = "UPDATE cart SET quantity = ? WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$newQuantity, $existingItem['id']]);
        } else {
            // Add new item
            $sql = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
            $stmt = $db->prepare($sql);
            $stmt->execute([$userId, $productId, $quantity]);
        }

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add to cart: ' . $e->getMessage()]);
    }
}

function handleUpdateCartItem($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id || !$data || !isset($data['quantity'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Cart item ID and quantity are required']);
            return;
        }

        $quantity = (int)$data['quantity'];

        if ($quantity <= 0) {
            // Remove item if quantity is 0 or negative
            $sql = "DELETE FROM cart WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$id]);
        } else {
            // Check stock before updating
            $sql = "SELECT p.stock_quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$id]);
            $product = $stmt->fetch();

            if (!$product || $product['stock_quantity'] < $quantity) {
                http_response_code(400);
                echo json_encode(['error' => 'Insufficient stock']);
                return;
            }

            $sql = "UPDATE cart SET quantity = ? WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$quantity, $id]);
        }

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update cart item: ' . $e->getMessage()]);
    }
}

function handleRemoveFromCart($db) {
    try {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Cart item ID is required']);
            return;
        }

        $sql = "DELETE FROM cart WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to remove from cart: ' . $e->getMessage()]);
    }
}
?>
