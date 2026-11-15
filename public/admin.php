<?php
session_start();

// ─── CONFIGURATION ──────────────────────────────────────────────────────────
define('ADMIN_PASSWORD', 'admin123');
define('DATA_FILE', 'success-stories.json');
// ────────────────────────────────────────────────────────────────────────────

// Handle Login
$error = '';
if (isset($_POST['login'])) {
    $password = $_POST['password'] ?? '';
    if ($password === ADMIN_PASSWORD) {
        $_SESSION['authenticated'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $error = 'Invalid password. Please try again.';
    }
}

// Handle Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Check Authentication
$authenticated = $_SESSION['authenticated'] ?? false;

// If not authenticated, render login page
if (!$authenticated) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login | Punjab Immigration</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            :root {
                --primary: #fab00d;
                --dark-blue: #06122e;
                --footer-bg: #040c1f;
                --white: #ffffff;
                --text: #333333;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Montserrat', sans-serif;
                background-color: var(--dark-blue);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                color: var(--white);
                padding: 20px;
            }
            .login-container {
                max-width: 400px;
                width: 100%;
                background-color: var(--footer-bg);
                border: 1px solid rgba(250, 176, 13, 0.15);
                border-radius: 20px;
                padding: 40px 30px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.5);
                text-align: center;
            }
            .logo img {
                height: 70px;
                margin-bottom: 25px;
            }
            h2 {
                font-family: 'Poppins', sans-serif;
                color: var(--primary);
                font-size: 1.8rem;
                margin-bottom: 10px;
            }
            p {
                font-size: 0.9rem;
                color: rgba(255,255,255,0.6);
                margin-bottom: 30px;
            }
            .input-group {
                position: relative;
                margin-bottom: 25px;
            }
            .input-group i {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--primary);
            }
            .input-group input {
                width: 100%;
                padding: 14px 15px 14px 45px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                color: var(--white);
                outline: none;
                transition: 0.3s;
                font-size: 1rem;
            }
            .input-group input:focus {
                border-color: var(--primary);
                background: rgba(255,255,255,0.1);
            }
            .btn {
                width: 100%;
                padding: 14px;
                background-color: var(--primary);
                color: var(--dark-blue);
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: 0.3s;
            }
            .btn:hover {
                background-color: var(--white);
                color: var(--dark-blue);
            }
            .error-msg {
                color: #ff4d4d;
                font-size: 0.85rem;
                margin-bottom: 20px;
                text-align: left;
                background: rgba(255, 77, 77, 0.1);
                padding: 10px 15px;
                border-radius: 5px;
                border-left: 3px solid #ff4d4d;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">
                <img src="logowhite.png" alt="Punjab Immigration Logo">
            </div>
            <h2>Admin Portal</h2>
            <p>Access Success Stories Manager</p>
            
            <?php if ($error): ?>
                <div class="error-msg"><i class="fa-solid fa-triangle-exclamation"></i> <?php echo $error; ?></div>
            <?php endif; ?>
            
            <form action="admin.php" method="POST">
                <div class="input-group">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" name="password" placeholder="Enter Password" required autofocus>
                </div>
                <button type="submit" name="login" class="btn">Login</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// ─── AUTHENTICATED STATE ───────────────────────────────────────────────────

// Read Data File
$data = ['videos' => [], 'gallery' => []];
if (file_exists(DATA_FILE)) {
    $json = file_get_contents(DATA_FILE);
    $decoded = json_decode($json, true);
    if (is_array($decoded)) {
        $data = array_merge($data, $decoded);
    }
}

// Helper to Save Data File
function save_data($data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    return file_put_contents(DATA_FILE, $json);
}

// Helper to Handle File Uploads
function handle_upload($file_key, $allowed_types) {
    if (!isset($_FILES[$file_key]) || $_FILES[$file_key]['error'] !== UPLOAD_ERR_OK) {
        return null; // No file uploaded or upload error
    }
    
    $file = $_FILES[$file_key];
    $filename = basename($file['name']);
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
    if (!in_array($ext, $allowed_types)) {
        return false; // Extension not allowed
    }
    
    // Create uploads directory if it doesn't exist
    if (!is_dir('uploads')) {
        mkdir('uploads', 0755, true);
    }
    
    // Clean filename to prevent path issues and duplicates
    $clean_name = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($filename, PATHINFO_FILENAME)) . '_' . time() . '.' . $ext;
    $target = 'uploads/' . $clean_name;
    
    if (move_uploaded_file($file['tmp_name'], $target)) {
        return '/uploads/' . $clean_name;
    }
    return false;
}

$message = '';
$msg_type = 'success';

// Handle Video Form Actions
if (isset($_POST['video_action'])) {
    $action = $_POST['video_action'];
    $idx = isset($_POST['index']) ? (int)$_POST['index'] : -1;
    
    $name = $_POST['name'] ?? '';
    $visa = $_POST['visa'] ?? '';
    
    if ($action !== 'delete') {
        // Handle Video Upload
        $video_path = handle_upload('video_file', ['mp4', 'mov', 'avi', 'mkv', 'webm']);
        if ($video_path === false) {
            $message = "Error: Invalid video file format (Only MP4, MOV, WebM allowed).";
            $msg_type = 'error';
        } elseif ($video_path === null) {
            $video_path = $_POST['existing_src'] ?? '';
        }
        
        // Handle Poster Upload
        $poster_path = handle_upload('poster_file', ['png', 'jpg', 'jpeg', 'webp']);
        if ($poster_path === false) {
            $message = "Error: Invalid poster thumbnail format (Only PNG, JPG, WebP allowed).";
            $msg_type = 'error';
        } elseif ($poster_path === null) {
            $poster_path = $_POST['existing_poster'] ?? '';
        }
    }

    if ($msg_type !== 'error') {
        if ($action === 'add') {
            $data['videos'][] = [
                'name' => $name,
                'visa' => $visa,
                'src' => $video_path,
                'poster' => $poster_path
            ];
            save_data($data);
            $message = "Video testimonial added successfully!";
        } elseif ($action === 'edit' && $idx >= 0 && isset($data['videos'][$idx])) {
            $data['videos'][$idx] = [
                'name' => $name,
                'visa' => $visa,
                'src' => $video_path,
                'poster' => $poster_path
            ];
            save_data($data);
            $message = "Video testimonial updated successfully!";
        } elseif ($action === 'delete' && $idx >= 0 && isset($data['videos'][$idx])) {
            array_splice($data['videos'], $idx, 1);
            save_data($data);
            $message = "Video testimonial removed successfully!";
        }
    }
}

// Handle Gallery Form Actions
if (isset($_POST['gallery_action'])) {
    $action = $_POST['gallery_action'];
    $idx = isset($_POST['index']) ? (int)$_POST['index'] : -1;
    
    $name = $_POST['name'] ?? '';
    $quote = $_POST['quote'] ?? '';
    
    if ($action !== 'delete') {
        // Handle Image Upload
        $img_path = handle_upload('gallery_img', ['png', 'jpg', 'jpeg', 'webp']);
        if ($img_path === false) {
            $message = "Error: Invalid image format (Only PNG, JPG, WebP allowed).";
            $msg_type = 'error';
        } elseif ($img_path === null) {
            $img_path = $_POST['existing_img'] ?? '';
        }
    }

    if ($msg_type !== 'error') {
        if ($action === 'add') {
            $data['gallery'][] = [
                'name' => $name,
                'quote' => $quote,
                'img' => $img_path
            ];
            save_data($data);
            $message = "Gallery approval card added successfully!";
        } elseif ($action === 'edit' && $idx >= 0 && isset($data['gallery'][$idx])) {
            $data['gallery'][$idx] = [
                'name' => $name,
                'quote' => $quote,
                'img' => $img_path
            ];
            save_data($data);
            $message = "Gallery approval card updated successfully!";
        } elseif ($action === 'delete' && $idx >= 0 && isset($data['gallery'][$idx])) {
            array_splice($data['gallery'], $idx, 1);
            save_data($data);
            $message = "Gallery approval card removed successfully!";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Success Stories Dashboard | Punjab Immigration</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #fab00d;
            --dark-blue: #06122e;
            --footer-bg: #040c1f;
            --light: #F5F7FA;
            --white: #ffffff;
            --text: #333333;
            --shadow: 0 10px 30px rgba(6,18,46,0.1);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--light);
            color: var(--text);
        }
        header {
            background-color: var(--dark-blue);
            color: var(--white);
            padding: 15px 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .header-container {
            max-width: 1200px;
            width: 90%;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header-logo img {
            height: 50px;
        }
        .header-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.25rem;
            color: var(--primary);
            font-weight: 600;
        }
        .logout-btn {
            color: var(--white);
            background-color: rgba(255, 255, 255, 0.1);
            padding: 8px 20px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            transition: 0.3s;
        }
        .logout-btn:hover {
            background-color: #ff4d4d;
        }
        main {
            max-width: 1200px;
            width: 90%;
            margin: 40px auto 80px;
        }
        
        /* Message Banner */
        .toast {
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        }
        .toast.toast-success {
            background-color: #25d366;
            color: var(--white);
        }
        .toast.toast-error {
            background-color: #ff4d4d;
            color: var(--white);
        }
        .toast i { font-size: 1.3rem; }
        
        /* Dashboard Tabs */
        .tabs-header {
            display: flex;
            gap: 15px;
            border-bottom: 2px solid rgba(6,18,46,0.08);
            margin-bottom: 30px;
        }
        .tab-btn {
            padding: 12px 25px;
            background: none;
            border: none;
            font-family: 'Poppins', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            color: #777;
            cursor: pointer;
            position: relative;
            transition: 0.3s;
        }
        .tab-btn.active {
            color: var(--dark-blue);
        }
        .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -2px; left: 0; width: 100%; height: 3px;
            background-color: var(--primary);
            border-radius: 5px;
        }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        /* Grid Layouts */
        .grid-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }
        .grid-header h3 {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            color: var(--dark-blue);
        }
        .add-btn {
            background-color: var(--dark-blue);
            color: var(--white);
            border: none;
            padding: 12px 25px;
            border-radius: 50px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .add-btn:hover {
            background-color: var(--primary);
            color: var(--dark-blue);
        }
        
        .list-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 25px;
        }
        
        /* Dashboard Cards */
        .card {
            background: var(--white);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: var(--shadow);
            border: 1px solid rgba(6,18,46,0.05);
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .card-visual {
            height: 180px;
            position: relative;
            background-color: #ddd;
            overflow: hidden;
        }
        .card-visual img, .card-visual video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .card-visual .badge {
            position: absolute;
            top: 15px; right: 15px;
            background-color: var(--primary);
            color: var(--dark-blue);
            padding: 5px 12px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            z-index: 2;
        }
        .card-body {
            padding: 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        .card-body h4 {
            font-size: 1.15rem;
            color: var(--dark-blue);
            margin-bottom: 5px;
            font-weight: 700;
        }
        .card-body p {
            font-size: 0.9rem;
            color: #666;
            line-height: 1.5;
            margin-bottom: 20px;
            font-style: italic;
        }
        .card-actions {
            display: flex;
            gap: 10px;
            margin-top: auto;
            border-top: 1px solid rgba(6,18,46,0.08);
            padding-top: 15px;
        }
        .action-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-edit {
            background-color: rgba(6,18,46,0.05);
            color: var(--dark-blue);
        }
        .btn-edit:hover {
            background-color: var(--dark-blue);
            color: var(--white);
        }
        .btn-delete {
            background-color: rgba(255, 77, 77, 0.08);
            color: #ff4d4d;
        }
        .btn-delete:hover {
            background-color: #ff4d4d;
            color: var(--white);
        }
        
        /* Modal Backdrop */
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(6,18,46,0.6);
            backdrop-filter: blur(5px);
            z-index: 100;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.2s ease-out;
            overflow-y: auto;
        }
        .modal.active { display: flex; }
        .modal-content {
            max-width: 500px;
            width: 100%;
            background: var(--white);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            animation: scaleUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
            margin: auto;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }
        .modal-header h4 {
            font-family: 'Poppins', sans-serif;
            font-size: 1.3rem;
            color: var(--dark-blue);
        }
        .close-modal {
            font-size: 1.5rem;
            color: #888;
            cursor: pointer;
            background: none;
            border: none;
        }
        .close-modal:hover { color: #333; }
        
        /* Form fields */
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--dark-blue);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid rgba(6,18,46,0.15);
            border-radius: 10px;
            font-family: inherit;
            font-size: 0.95rem;
            outline: none;
            transition: 0.3s;
        }
        .form-group input:focus, .form-group textarea:focus {
            border-color: var(--primary);
            box-shadow: 0 0 5px rgba(250, 176, 13, 0.2);
        }
        
        /* DRAG & DROP FILE UPLOAD STYLING */
        .drag-drop-zone {
            width: 100%;
            min-height: 110px;
            border: 2px dashed rgba(6, 18, 46, 0.2);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 15px;
            background: rgba(6,18,46,0.02);
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            position: relative;
        }
        .drag-drop-zone:hover, .drag-drop-zone.dragover {
            border-color: var(--primary);
            background: rgba(250, 176, 13, 0.05);
        }
        .drag-drop-zone i {
            font-size: 1.8rem;
            color: var(--primary);
            margin-bottom: 10px;
        }
        .drag-drop-zone p {
            font-size: 0.85rem;
            color: #666;
            line-height: 1.4;
        }
        .drag-drop-zone .file-name {
            font-size: 0.85rem;
            color: var(--dark-blue);
            font-weight: 600;
            margin-top: 5px;
            word-break: break-all;
        }
        .drag-drop-zone input[type="file"] {
            display: none;
        }
        .file-preview-hint {
            font-size: 0.8rem;
            color: #888;
            margin-top: 5px;
        }

        .form-actions-row {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        .form-actions-row .btn {
            flex: 1;
            padding: 12px;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: 0.2s;
            text-align: center;
        }
        .btn-cancel {
            background-color: #eee;
            color: #666;
        }
        .btn-cancel:hover { background-color: #ddd; }
        .btn-save {
            background-color: var(--dark-blue);
            color: var(--white);
        }
        .btn-save:hover {
            background-color: var(--primary);
            color: var(--dark-blue);
        }
        
        /* Animations */
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleUp {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    </style>
</head>
<body>
    <header>
        <div class="header-container">
            <div class="header-logo">
                <img src="logowhite.png" alt="Punjab Immigration">
            </div>
            <div class="header-title">Success Stories Dashboard</div>
            <a href="admin.php?logout=true" class="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
        </div>
    </header>

    <main>
        <?php if ($message): ?>
            <div class="toast <?php echo $msg_type === 'error' ? 'toast-error' : 'toast-success'; ?>" id="toast">
                <i class="fa-solid <?php echo $msg_type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'; ?>"></i>
                <span><?php echo htmlspecialchars($message); ?></span>
            </div>
            <script>
                setTimeout(() => {
                    const toast = document.getElementById('toast');
                    if (toast) toast.style.display = 'none';
                }, 4000);
            </script>
        <?php endif; ?>

        <div class="tabs-header">
            <button class="tab-btn active" onclick="switchTab('videos', this)"><i class="fa-solid fa-video"></i> Video Testimonials</button>
            <button class="tab-btn" onclick="switchTab('gallery', this)"><i class="fa-solid fa-images"></i> Approvals Gallery</button>
        </div>

        <!-- VIDEOS TAB -->
        <div class="tab-content active" id="tab-videos">
            <div class="grid-header">
                <h3>Videos (<?php echo count($data['videos']); ?>)</h3>
                <button class="add-btn" onclick="openAddVideoModal()"><i class="fa-solid fa-plus"></i> Add Video</button>
            </div>
            
            <div class="list-grid">
                <?php foreach ($data['videos'] as $index => $video): ?>
                    <div class="card">
                        <div class="card-visual">
                            <span class="badge"><?php echo htmlspecialchars($video['visa']); ?></span>
                            <?php if ($video['poster']): ?>
                                <img src="<?php echo htmlspecialchars($video['poster']); ?>" alt="Poster">
                            <?php else: ?>
                                <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#06122e;color:#fff;">
                                    <i class="fa-solid fa-video" style="font-size:3rem;"></i>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div class="card-body">
                            <h4><?php echo htmlspecialchars($video['name']); ?></h4>
                            <p style="font-style: normal; margin-bottom: 5px; color: var(--primary); font-weight:600;">
                                <?php echo htmlspecialchars($video['visa']); ?>
                            </p>
                            <p style="font-style: normal; margin-bottom: 5px; font-size:0.8rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                                File: <code><?php echo htmlspecialchars($video['src']); ?></code>
                            </p>
                            <div class="card-actions">
                                <button class="action-btn btn-edit" onclick="openEditVideoModal(<?php echo $index; ?>, <?php echo htmlspecialchars(json_encode($video)); ?>)"><i class="fa-solid fa-pen"></i> Edit</button>
                                <button class="action-btn btn-delete" onclick="openDeleteVideoModal(<?php echo $index; ?>, 'video', '<?php echo htmlspecialchars(addslashes($video['name'])); ?>')"><i class="fa-solid fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- GALLERY TAB -->
        <div class="tab-content" id="tab-gallery">
            <div class="grid-header">
                <h3>Gallery Approvals (<?php echo count($data['gallery']); ?>)</h3>
                <button class="add-btn" onclick="openAddGalleryModal()"><i class="fa-solid fa-plus"></i> Add Card</button>
            </div>
            
            <div class="list-grid">
                <?php foreach ($data['gallery'] as $index => $item): ?>
                    <div class="card">
                        <div class="card-visual" style="height: 220px;">
                            <img src="<?php echo htmlspecialchars($item['img']); ?>" alt="Approval Picture">
                        </div>
                        <div class="card-body">
                            <h4><?php echo htmlspecialchars($item['name']); ?></h4>
                            <p>"<?php echo htmlspecialchars(mb_strimwidth($item['quote'], 0, 120, '...')); ?>"</p>
                            <div class="card-actions">
                                <button class="action-btn btn-edit" onclick="openEditGalleryModal(<?php echo $index; ?>, <?php echo htmlspecialchars(json_encode($item)); ?>)"><i class="fa-solid fa-pen"></i> Edit</button>
                                <button class="action-btn btn-delete" onclick="openDeleteGalleryModal(<?php echo $index; ?>, 'gallery', '<?php echo htmlspecialchars(addslashes($item['name'])); ?>')"><i class="fa-solid fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>

    <!-- VIDEO FORM MODAL -->
    <div class="modal" id="video-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="video-modal-title">Add Video Testimonial</h4>
                <button class="close-modal" onclick="closeModal('video-modal')">&times;</button>
            </div>
            <form action="admin.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="video_action" id="video-form-action" value="add">
                <input type="hidden" name="index" id="video-form-index" value="-1">
                <input type="hidden" name="existing_src" id="video-form-existing-src" value="">
                <input type="hidden" name="existing_poster" id="video-form-existing-poster" value="">
                
                <div class="form-group">
                    <label>Client Name</label>
                    <input type="text" name="name" id="video-form-name" placeholder="e.g. Harpal Singh" required>
                </div>
                <div class="form-group">
                    <label>Visa Type / Category</label>
                    <input type="text" name="visa" id="video-form-visa" placeholder="e.g. UK Study Visa" required>
                </div>
                
                <div class="form-group">
                    <label>Video Testimonial File</label>
                    <div class="drag-drop-zone" id="drop-video-src">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <p>Drag & drop <b>Video (.mp4)</b> here or click to select</p>
                        <span class="file-name" id="label-video-src">No file selected</span>
                        <input type="file" name="video_file" id="video-file-src" accept="video/mp4,video/quicktime,video/webm">
                    </div>
                    <p class="file-preview-hint" id="hint-video-src"></p>
                </div>

                <div class="form-group">
                    <label>Poster Thumbnail Image</label>
                    <div class="drag-drop-zone" id="drop-video-poster">
                        <i class="fa-solid fa-image"></i>
                        <p>Drag & drop <b>Thumbnail (.png, .jpg)</b> here or click to select</p>
                        <span class="file-name" id="label-video-poster">No file selected</span>
                        <input type="file" name="poster_file" id="video-file-poster" accept="image/png,image/jpeg,image/webp">
                    </div>
                    <p class="file-preview-hint" id="hint-video-poster"></p>
                </div>
                
                <div class="form-actions-row">
                    <button type="button" class="btn btn-cancel" onclick="closeModal('video-modal')">Cancel</button>
                    <button type="submit" class="btn btn-save">Save changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- GALLERY FORM MODAL -->
    <div class="modal" id="gallery-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="gallery-modal-title">Add Gallery Approval</h4>
                <button class="close-modal" onclick="closeModal('gallery-modal')">&times;</button>
            </div>
            <form action="admin.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="gallery_action" id="gallery-form-action" value="add">
                <input type="hidden" name="index" id="gallery-form-index" value="-1">
                <input type="hidden" name="existing_img" id="gallery-form-existing-img" value="">
                
                <div class="form-group">
                    <label>Client Name</label>
                    <input type="text" name="name" id="gallery-form-name" placeholder="e.g. Jagbir Singh" required>
                </div>
                
                <div class="form-group">
                    <label>Approval Picture</label>
                    <div class="drag-drop-zone" id="drop-gallery-img">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <p>Drag & drop <b>Visa Photo</b> here or click to select</p>
                        <span class="file-name" id="label-gallery-img">No file selected</span>
                        <input type="file" name="gallery_img" id="gallery-file-img" accept="image/png,image/jpeg,image/webp">
                    </div>
                    <p class="file-preview-hint" id="hint-gallery-img"></p>
                </div>

                <div class="form-group">
                    <label>Quote / Testimonial text</label>
                    <textarea name="quote" id="gallery-form-quote" rows="4" placeholder="Client feedback text..." required></textarea>
                </div>
                
                <div class="form-actions-row">
                    <button type="button" class="btn btn-cancel" onclick="closeModal('gallery-modal')">Cancel</button>
                    <button type="submit" class="btn btn-save">Save changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div class="modal" id="delete-modal">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <div class="modal-header" style="margin-bottom: 15px;">
                <h4 style="color:#ff4d4d;"><i class="fa-solid fa-triangle-exclamation"></i> Delete Entry</h4>
                <button class="close-modal" onclick="closeModal('delete-modal')">&times;</button>
            </div>
            <p style="margin-bottom: 25px; font-size: 1rem; color:#444;" id="delete-modal-text">Are you sure you want to remove this item?</p>
            <form action="admin.php" method="POST">
                <input type="hidden" name="index" id="delete-form-index" value="-1">
                <input type="hidden" name="video_action" id="delete-form-video-action" value="">
                <input type="hidden" name="gallery_action" id="delete-form-gallery-action" value="">
                
                <div class="form-actions-row">
                    <button type="button" class="btn btn-cancel" onclick="closeModal('delete-modal')">No, Cancel</button>
                    <button type="submit" class="btn" style="background:#ff4d4d; color:white;">Yes, Delete</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function switchTab(tabId, el) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            el.classList.add('active');
            document.getElementById('tab-' + tabId).classList.add('active');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
        }

        // Setup Drag and Drop functionality
        function setupDragDrop(zoneId, inputId, labelId) {
            const zone = document.getElementById(zoneId);
            const input = document.getElementById(inputId);
            const label = document.getElementById(labelId);

            // Click zone to open file browser
            zone.addEventListener('click', () => input.click());

            // Dragover state change
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('dragover');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('dragover');
            });

            // Handle dropped file
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    input.files = e.dataTransfer.files;
                    updateFileLabel(input, label);
                }
            });

            // Handle file selection
            input.addEventListener('change', () => {
                updateFileLabel(input, label);
            });
        }

        function updateFileLabel(input, label) {
            if (input.files && input.files[0]) {
                label.innerText = input.files[0].name + " (" + formatBytes(input.files[0].size) + ")";
            } else {
                label.innerText = "No file selected";
            }
        }

        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        // Attach drag drop events
        setupDragDrop('drop-video-src', 'video-file-src', 'label-video-src');
        setupDragDrop('drop-video-poster', 'video-file-poster', 'label-video-poster');
        setupDragDrop('drop-gallery-img', 'gallery-file-img', 'label-gallery-img');


        // Videos Modal Operations
        function openAddVideoModal() {
            document.getElementById('video-modal-title').innerText = "Add Video Testimonial";
            document.getElementById('video-form-action').value = "add";
            document.getElementById('video-form-index').value = "-1";
            document.getElementById('video-form-name').value = "";
            document.getElementById('video-form-visa').value = "";
            
            document.getElementById('video-form-existing-src').value = "";
            document.getElementById('video-form-existing-poster').value = "";
            document.getElementById('label-video-src').innerText = "No file selected";
            document.getElementById('label-video-poster').innerText = "No file selected";
            document.getElementById('hint-video-src').innerText = "";
            document.getElementById('hint-video-poster').innerText = "";
            
            // Files not required when adding, but good practice
            document.getElementById('video-file-src').required = true;
            document.getElementById('video-file-poster').required = true;
            
            document.getElementById('video-modal').classList.add('active');
        }

        function openEditVideoModal(index, data) {
            document.getElementById('video-modal-title').innerText = "Edit Video Testimonial";
            document.getElementById('video-form-action').value = "edit";
            document.getElementById('video-form-index').value = index;
            document.getElementById('video-form-name').value = data.name;
            document.getElementById('video-form-visa').value = data.visa;
            
            document.getElementById('video-form-existing-src').value = data.src;
            document.getElementById('video-form-existing-poster').value = data.poster;
            document.getElementById('label-video-src').innerText = "Keep existing file (or drag new here)";
            document.getElementById('label-video-poster').innerText = "Keep existing image (or drag new here)";
            document.getElementById('hint-video-src').innerText = "Current file: " + data.src;
            document.getElementById('hint-video-poster').innerText = "Current poster: " + data.poster;
            
            // Files are optional when editing (keep existing if empty)
            document.getElementById('video-file-src').required = false;
            document.getElementById('video-file-poster').required = false;
            
            document.getElementById('video-modal').classList.add('active');
        }

        // Gallery Modal Operations
        function openAddGalleryModal() {
            document.getElementById('gallery-modal-title').innerText = "Add Gallery Approval";
            document.getElementById('gallery-form-action').value = "add";
            document.getElementById('gallery-form-index').value = "-1";
            document.getElementById('gallery-form-name').value = "";
            document.getElementById('gallery-form-quote').value = "";
            
            document.getElementById('gallery-form-existing-img').value = "";
            document.getElementById('label-gallery-img').innerText = "No file selected";
            document.getElementById('hint-gallery-img').innerText = "";
            document.getElementById('gallery-file-img').required = true;
            
            document.getElementById('gallery-modal').classList.add('active');
        }

        function openEditGalleryModal(index, data) {
            document.getElementById('gallery-modal-title').innerText = "Edit Gallery Approval";
            document.getElementById('gallery-form-action').value = "edit";
            document.getElementById('gallery-form-index').value = index;
            document.getElementById('gallery-form-name').value = data.name;
            document.getElementById('gallery-form-quote').value = data.quote;
            
            document.getElementById('gallery-form-existing-img').value = data.img;
            document.getElementById('label-gallery-img').innerText = "Keep existing photo (or drag new here)";
            document.getElementById('hint-gallery-img').innerText = "Current photo: " + data.img;
            document.getElementById('gallery-file-img').required = false;
            
            document.getElementById('gallery-modal').classList.add('active');
        }

        // Delete Modal
        function openDeleteVideoModal(index, type, name) {
            document.getElementById('delete-modal-text').innerText = 'Are you sure you want to delete the video testimonial for "' + name + '"?';
            document.getElementById('delete-form-index').value = index;
            document.getElementById('delete-form-video-action').value = "delete";
            document.getElementById('delete-form-gallery-action').value = "";
            document.getElementById('delete-modal').classList.add('active');
        }

        function openDeleteGalleryModal(index, type, name) {
            document.getElementById('delete-modal-text').innerText = 'Are you sure you want to delete the gallery approval card for "' + name + '"?';
            document.getElementById('delete-form-index').value = index;
            document.getElementById('delete-form-video-action').value = "";
            document.getElementById('delete-form-gallery-action').value = "delete";
            document.getElementById('delete-modal').classList.add('active');
        }
    </script>
</body>
</html>
