CREATE TABLE IF NOT EXISTS site_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO site_config (`key`, `value`) VALUES
('logo_url', 'https://d2xsxph8kpxj0f.cloudfront.net/310519663364198732/2vuJLs9j7vTiL4E4emfRJ8/muwakaba_logo_v2-SCNMsUQ2s4hs6UtaXq88Y7.webp'),
('whatsapp_number', '966558648275'),
('whatsapp_message', 'السلام عليكم، أودّ الاستفسار عن خدمات التوطين والموارد البشرية.'),
('support_email', 'support@muwakaba.sa'),
('contact_email', 'jzaalbqmy183@gmail.com'),
('phone_number', '0558648275');
