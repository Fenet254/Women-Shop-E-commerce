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
        handleGetUser($db);
        break;
    case 'POST':
        handleCreateUser($db);
        break;
    case 'PUT':
        handleUpdateUser($db);
        break;
    case 'DELETE':
        handleDeleteUser($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetUser($db) {
    try {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            return;
        }

        $sql = "SELECT id, username, email, first_name, last_name, phone, address, created_at FROM users WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }

        echo json_encode(['success' => true, 'user' => $user]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch user: ' . $e->getMessage()]);
    }
}

function handleCreateUser($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username, email, and password are required']);
            return;
        }

        // Check if user already exists
        $sql = "SELECT id FROM users WHERE username = ? OR email = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$data['username'], $data['email']]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Username or email already exists']);
            return;
        }

        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (username, email, password, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            $data['username'],
            $data['email'],
            $hashedPassword,
            $data['first_name'] ?? '',
            $data['last_name'] ?? '',
            $data['phone'] ?? '',
            $data['address'] ?? ''
        ]);

        $userId = $db->lastInsertId();
        echo json_encode(['success' => true, 'user_id' => $userId]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create user: ' . $e->getMessage()]);
    }
}

function handleUpdateUser($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id || !$data) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and data are required']);
            return;
        }

        $sql = "UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            $data['first_name'] ?? '',
            $data['last_name'] ?? '',
            $data['phone'] ?? '',
            $data['address'] ?? '',
            $id
        ]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user: ' . $e->getMessage()]);
    }
}

function handleDeleteUser($db) {
    try {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            return;
        }

        $sql = "DELETE FROM users WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete user: ' . $e->getMessage()]);
    }
}

// Login endpoint (separate from standard CRUD)
if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'login') {
    handleLogin($db);
}

function handleLogin($db) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }

        $sql = "SELECT id, username, email, password, first_name, last_name FROM users WHERE username = ? OR email = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$data['username'], $data['email'] ?? $data['username']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }

        // Start session for authentication
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];

        unset($user['password']); // Don't send password back
        echo json_encode(['success' => true, 'user' => $user]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Login failed: ' . $e->getMessage()]);
    }
}
?>
