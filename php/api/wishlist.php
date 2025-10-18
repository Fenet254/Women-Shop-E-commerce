<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        handleGetWishlist($db);
        break;
    case 'POST':
        handleAddToWishlist($db);
        break;
    case 'DELETE':
        handleRemoveFromWishlist($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetWishlist($db) {
    try {
        $userId = $_GET['user_id'] ?? null;

        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            return;
        }

        $sql = "SELECT w.id, w.added_at, p.id as product_id, p.name, p.price, p.image, c.name as category_name
                FROM wishlist w
                JOIN products p ON w.product_id = p.id
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE w.user_id = ? AND p.is_active = 1
                ORDER BY w.added_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId]);
        $wishlistItems = $stmt->fetchAll();

        echo json_encode(['success' => true, 'wishlist' => $wishlistItems]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch wishlist: ' . $e->getMessage()]);
    }
}

function handleAddToWishlist($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['user_id']) || !isset($data['product_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and product ID are required']);
            return;
        }

        $userId = $data['user_id'];
        $productId = $data['product_id'];

        // Check if product exists
        $sql = "SELECT id FROM products WHERE id = ? AND is_active = 1";
        $stmt = $db->prepare($sql);
        $stmt->execute([$productId]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }

        // Check if already in wishlist
        $sql = "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId, $productId]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Product already in wishlist']);
            return;
        }

        $sql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId, $productId]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add to wishlist: ' . $e->getMessage()]);
    }
}

function handleRemoveFromWishlist($db) {
    try {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Wishlist item ID is required']);
            return;
        }

        $sql = "DELETE FROM wishlist WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to remove from wishlist: ' . $e->getMessage()]);
    }
}
?>
