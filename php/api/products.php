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
        handleGetProducts($db);
        break;
    case 'POST':
        handleCreateProduct($db);
        break;
    case 'PUT':
        handleUpdateProduct($db);
        break;
    case 'DELETE':
        handleDeleteProduct($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetProducts($db) {
    try {
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $search = isset($_GET['search']) ? $_GET['search'] : null;
        $sort = isset($_GET['sort']) ? $_GET['sort'] : 'name';
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

        $sql = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1";
        $params = [];

        if ($category && $category !== 'all') {
            $sql .= " AND c.name = ?";
            $params[] = $category;
        }

        if ($search) {
            $sql .= " AND (p.name LIKE ? OR p.description LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        // Sorting
        switch ($sort) {
            case 'price-low':
                $sql .= " ORDER BY p.price ASC";
                break;
            case 'price-high':
                $sql .= " ORDER BY p.price DESC";
                break;
            case 'name':
            default:
                $sql .= " ORDER BY p.name ASC";
                break;
        }

        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        echo json_encode(['success' => true, 'products' => $products]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch products: ' . $e->getMessage()]);
    }
}

function handleCreateProduct($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['name']) || !isset($data['price'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and price are required']);
            return;
        }

        $sql = "INSERT INTO products (name, description, price, image, category_id, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['description'] ?? '',
            $data['price'],
            $data['image'] ?? '',
            $data['category_id'] ?? null,
            $data['stock_quantity'] ?? 0
        ]);

        $productId = $db->lastInsertId();
        echo json_encode(['success' => true, 'product_id' => $productId]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create product: ' . $e->getMessage()]);
    }
}

function handleUpdateProduct($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id || !$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID and data are required']);
            return;
        }

        $sql = "UPDATE products SET name = ?, description = ?, price = ?, image = ?, category_id = ?, stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            $data['name'] ?? '',
            $data['description'] ?? '',
            $data['price'] ?? 0,
            $data['image'] ?? '',
            $data['category_id'] ?? null,
            $data['stock_quantity'] ?? 0,
            $id
        ]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update product: ' . $e->getMessage()]);
    }
}

function handleDeleteProduct($db) {
    try {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID is required']);
            return;
        }

        $sql = "UPDATE products SET is_active = 0 WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete product: ' . $e->getMessage()]);
    }
}
?>
