-- ############################################
-- ChidiyaAI Test Data - Suppliers & Products
-- Compatible with Prisma schema
-- ############################################

-- First, let's create the cities table if needed for reference
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100),
    region VARCHAR(50)
);

-- Insert Delhi NCR cities
INSERT INTO cities(name, state, region) VALUES
('Lucknow', 'Uttar Pradesh', 'UP'),
('Noida', 'Uttar Pradesh', 'NCR'),
('Greater Noida', 'Uttar Pradesh', 'NCR'),
('Ghaziabad', 'Uttar Pradesh', 'NCR'),
('Meerut', 'Uttar Pradesh', 'UP'),
('New Delhi', 'Delhi', 'NCR'),
('Gurugram', 'Haryana', 'NCR'),
('Faridabad', 'Haryana', 'NCR'),
('Panipat', 'Haryana', 'Haryana'),
('Sonipat', 'Haryana', 'NCR'),
('Rohtak', 'Haryana', 'Haryana'),
('Jaipur', 'Rajasthan', 'Rajasthan'),
('Chandigarh', 'Punjab', 'Punjab'),
('Agra', 'Uttar Pradesh', 'UP'),
('Dehradun', 'Uttarakhand', 'UK')
ON CONFLICT (name) DO NOTHING;

-- Categories table for products
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    description TEXT
);

-- Insert 5 main product categories
INSERT INTO categories(name, display_name, description) VALUES
('corrugated_boxes', 'Corrugated Boxes', 'All types of corrugated boxes for shipping and packaging'),
('bubble_wrap', 'Bubble Wrap', 'Protective bubble wrap rolls and sheets'),
('paper_cups', 'Paper Cups', 'Disposable paper cups for beverages'),
('bopp_tapes', 'BOPP Tapes', 'Packaging tapes - brown, transparent, printed'),
('shipping_bags', 'Shipping Bags', 'Courier bags, poly mailers, and shipping pouches'),
('packaging', 'General Packaging', 'Other packaging materials')
ON CONFLICT (name) DO NOTHING;

-- ############################################
-- Lucknow: 10 suppliers
-- ############################################
INSERT INTO suppliers(id, "companyName", email, password, phone, "gstNumber", "productCategories", capacity, moq, city, state, address, status, badges, description, "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'Lucknow Pack Studio', 'lkpackstudio@test.com', '$2a$10$test', '+91-9000000101', 'GST09AABCD1234E1Z5', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'large', '50 boxes', 'Lucknow', 'Uttar Pradesh', 'Hazratganj, Lucknow', 'approved', ARRAY['verified','gst'], 'Designer corrugated boxes with window options', NOW(), NOW()),
(gen_random_uuid(), 'LK Corrugate Pros', 'lkcorrugate@test.com', '$2a$10$test', '+91-9000000102', 'GST09AABCE5678F2Z3', ARRAY['Corrugated Boxes'], 'enterprise', '100 boxes', 'Lucknow', 'Uttar Pradesh', 'Chinhat Industrial Area, Lucknow', 'approved', ARRAY['verified'], 'Stackable crates and storage boxes', NOW(), NOW()),
(gen_random_uuid(), 'Lucknow Box Designers', 'lkboxdesigners@test.com', '$2a$10$test', '+91-9000000103', 'GST09AABCF9012G3Z1', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'medium', '100 boxes', 'Lucknow', 'Uttar Pradesh', 'Aliganj, Lucknow', 'approved', ARRAY['verified','gst','premium'], 'Printed gift boxes with gloss finish', NOW(), NOW()),
(gen_random_uuid(), 'GreenWrap LK', 'greenwraplk@test.com', '$2a$10$test', '+91-9000000104', 'GST09AABCG3456H4Z2', ARRAY['Bubble Wrap', 'Paper Cups'], 'medium', '100 rolls', 'Lucknow', 'Uttar Pradesh', 'Gomti Nagar, Lucknow', 'approved', ARRAY['verified','gst'], 'Eco-friendly wrap and compostable cups', NOW(), NOW()),
(gen_random_uuid(), 'LK Quick Supplies', 'lkquicksupply@test.com', '$2a$10$test', '+91-9000000105', 'GST09AABCH7890I5Z3', ARRAY['Corrugated Boxes', 'BOPP Tapes'], 'small', '250 units', 'Lucknow', 'Uttar Pradesh', 'Vikas Nagar, Lucknow', 'approved', ARRAY['verified'], 'Quick dispatch assorted packaging', NOW(), NOW()),
(gen_random_uuid(), 'Lucknow Custom Prints', 'lkcustomprints@test.com', '$2a$10$test', '+91-9000000106', 'GST09AABCI1234J6Z4', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'large', '200 boxes', 'Lucknow', 'Uttar Pradesh', 'Amausi Industrial Area, Lucknow', 'approved', ARRAY['verified','gst','premium'], 'Full color custom print corrugated boxes', NOW(), NOW()),
(gen_random_uuid(), 'LK Food-Pack Solutions', 'lkfoodpack@test.com', '$2a$10$test', '+91-9000000107', 'GST09AABCJ5678K7Z5', ARRAY['Paper Cups', 'Shipping Bags'], 'medium', '1000 cups', 'Lucknow', 'Uttar Pradesh', 'Alambagh, Lucknow', 'approved', ARRAY['verified','gst'], 'Food-grade paper cups and liners', NOW(), NOW()),
(gen_random_uuid(), 'Lucknow Industrial Pack', 'lkindustrialpack@test.com', '$2a$10$test', '+91-9000000108', 'GST09AABCK9012L8Z6', ARRAY['Corrugated Boxes'], 'enterprise', '10 boxes', 'Lucknow', 'Uttar Pradesh', 'Talkatora Industrial Area, Lucknow', 'approved', ARRAY['verified'], 'Heavy duty triple wall industrial boxes', NOW(), NOW()),
(gen_random_uuid(), 'LK BulkBox Traders', 'lkbulkbox@test.com', '$2a$10$test', '+91-9000000109', 'GST09AABCL3456M9Z7', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'enterprise', '1000 boxes', 'Lucknow', 'Uttar Pradesh', 'Transport Nagar, Lucknow', 'approved', ARRAY['verified','gst'], 'Bulk economy boxes for wholesalers', NOW(), NOW()),
(gen_random_uuid(), 'Lucknow Sleeve Makers', 'lksleeves@test.com', '$2a$10$test', '+91-9000000110', 'GST09AABCM7890N1Z8', ARRAY['Shipping Bags', 'Corrugated Boxes'], 'small', '500 pcs', 'Lucknow', 'Uttar Pradesh', 'Indira Nagar, Lucknow', 'approved', ARRAY['verified'], 'Bottle sleeves and slim corrugated options', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ############################################
-- Noida: 10 suppliers
-- ############################################
INSERT INTO suppliers(id, "companyName", email, password, phone, "gstNumber", "productCategories", capacity, moq, city, state, address, status, badges, description, "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'Noida Box Lab', 'noidaboxlab@test.com', '$2a$10$test', '+91-9000000111', 'GST09NOIDAB1234A1Z1', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'large', '200 boxes', 'Noida', 'Uttar Pradesh', 'Sector 63, Noida', 'approved', ARRAY['verified','gst','premium'], 'E-commerce optimized shipping boxes', NOW(), NOW()),
(gen_random_uuid(), 'NDX Eco Supplies', 'ndxeco@test.com', '$2a$10$test', '+91-9000000112', 'GST09NOIDAC5678B2Z2', ARRAY['Bubble Wrap', 'Paper Cups'], 'medium', '10 rolls', 'Noida', 'Uttar Pradesh', 'Sector 18, Noida', 'approved', ARRAY['verified'], 'Recycled bubble wrap and eco cups', NOW(), NOW()),
(gen_random_uuid(), 'Noida Custom Packs', 'noidacustom@test.com', '$2a$10$test', '+91-9000000113', 'GST09NOIDAAE9012C3Z3', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'large', '100 boxes', 'Greater Noida', 'Uttar Pradesh', 'Alpha 2, Greater Noida', 'approved', ARRAY['verified','gst','premium'], 'Window gift cartons with custom print', NOW(), NOW()),
(gen_random_uuid(), 'Noida QuickPrints', 'noidaquickprints@test.com', '$2a$10$test', '+91-9000000114', 'GST09NOIDAB3456D4Z4', ARRAY['Shipping Bags', 'Corrugated Boxes'], 'medium', '500 pcs', 'Noida', 'Uttar Pradesh', 'Sector 62, Noida', 'approved', ARRAY['verified','gst'], 'Fast print labels and promo boxes', NOW(), NOW()),
(gen_random_uuid(), 'NDX Cup Solutions', 'ndxcups@test.com', '$2a$10$test', '+91-9000000115', 'GST09NOIDAC7890E5Z5', ARRAY['Paper Cups'], 'large', '500 cups', 'Noida', 'Uttar Pradesh', 'Sector 10, Noida', 'approved', ARRAY['verified'], 'Double-wall hot cups and cold drink cups', NOW(), NOW()),
(gen_random_uuid(), 'Noida Industrial Sheets', 'noidaindsheets@test.com', '$2a$10$test', '+91-9000000116', 'GST09NOIDAB1234F6Z6', ARRAY['Corrugated Boxes', 'Bubble Wrap'], 'enterprise', '10 sheets', 'Noida', 'Uttar Pradesh', 'Sector 80, Noida', 'approved', ARRAY['verified','gst'], 'Heavy-duty corrugated sheets and trays', NOW(), NOW()),
(gen_random_uuid(), 'Noida Bag Makers', 'noidabags@test.com', '$2a$10$test', '+91-9000000117', 'GST09NOIDAC5678G7Z7', ARRAY['Shipping Bags'], 'medium', '500 bags', 'Noida', 'Uttar Pradesh', 'Sector 59, Noida', 'approved', ARRAY['verified'], 'Grocery kraft and non-woven bags', NOW(), NOW()),
(gen_random_uuid(), 'NDX FoamTech', 'ndxfoam@test.com', '$2a$10$test', '+91-9000000118', 'GST09NOIDAB9012H8Z8', ARRAY['Bubble Wrap', 'Shipping Bags'], 'large', '10 rolls', 'Noida', 'Uttar Pradesh', 'Sector 135, Noida', 'approved', ARRAY['verified','gst','premium'], 'High-density foam rolls and inserts', NOW(), NOW()),
(gen_random_uuid(), 'Noida Wrap Studio', 'noidawrap@test.com', '$2a$10$test', '+91-9000000119', 'GST09NOIDAC3456I9Z9', ARRAY['Bubble Wrap', 'Corrugated Boxes'], 'small', '5 rolls', 'Noida', 'Uttar Pradesh', 'Sector 44, Noida', 'approved', ARRAY['verified'], 'Cling film and sleeve boxes', NOW(), NOW()),
(gen_random_uuid(), 'Noida Labelworks', 'noidalabels@test.com', '$2a$10$test', '+91-9000000120', 'GST09NOIDAB7890J1Z1', ARRAY['BOPP Tapes', 'Shipping Bags'], 'medium', '1000 labels', 'Greater Noida', 'Uttar Pradesh', 'Pari Chowk, Greater Noida', 'approved', ARRAY['verified','gst'], 'Barcode and tamper-evident labels', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ############################################
-- Gurugram: 10 suppliers
-- ############################################
INSERT INTO suppliers(id, "companyName", email, password, phone, "gstNumber", "productCategories", capacity, moq, city, state, address, status, badges, description, "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'Gurgaon Pack Lab', 'ggpacklab@test.com', '$2a$10$test', '+91-9000000121', 'GST06GGNAB1234A1Z1', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'large', '80 boxes', 'Gurugram', 'Haryana', 'Udyog Vihar Phase 4, Gurugram', 'approved', ARRAY['verified','gst','premium'], 'Fashion retail display boxes', NOW(), NOW()),
(gen_random_uuid(), 'GGN Rapid Boxes', 'ggnrapid@test.com', '$2a$10$test', '+91-9000000122', 'GST06GGNAC5678B2Z2', ARRAY['Corrugated Boxes', 'BOPP Tapes'], 'medium', '100 boxes', 'Gurugram', 'Haryana', 'Sector 37, Gurugram', 'approved', ARRAY['verified'], 'Same-day express box manufacturing', NOW(), NOW()),
(gen_random_uuid(), 'Gurgaon EcoPackers', 'ggnecopack@test.com', '$2a$10$test', '+91-9000000123', 'GST06GGNAB9012C3Z3', ARRAY['Bubble Wrap', 'Paper Cups'], 'medium', '200 pcs', 'Gurugram', 'Haryana', 'Sector 18, Gurugram', 'approved', ARRAY['verified','gst'], 'Plant-fiber wraps and compostable cups', NOW(), NOW()),
(gen_random_uuid(), 'GGN Print House', 'ggnprinthouse@test.com', '$2a$10$test', '+91-9000000124', 'GST06GGNAC3456D4Z4', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'large', '60 boxes', 'Gurugram', 'Haryana', 'DLF Phase 3, Gurugram', 'approved', ARRAY['verified','gst','premium'], 'Large format and luxury printed boxes', NOW(), NOW()),
(gen_random_uuid(), 'Gurgaon CupWorks', 'ggncupworks@test.com', '$2a$10$test', '+91-9000000125', 'GST06GGNAB7890E5Z5', ARRAY['Paper Cups'], 'large', '600 cups', 'Gurugram', 'Haryana', 'Sector 44, Gurugram', 'approved', ARRAY['verified'], 'Cold drink and hot beverage cups', NOW(), NOW()),
(gen_random_uuid(), 'GGN HeavyPack', 'ggnheavypack@test.com', '$2a$10$test', '+91-9000000126', 'GST06GGNAC1234F6Z6', ARRAY['Corrugated Boxes', 'Shipping Bags'], 'enterprise', '5 boxes', 'Gurugram', 'Haryana', 'IMT Manesar, Gurugram', 'approved', ARRAY['verified','gst'], 'Heavy-duty pallet boxes and metal straps', NOW(), NOW()),
(gen_random_uuid(), 'Gurgaon Tape & Label', 'ggntapelabel@test.com', '$2a$10$test', '+91-9000000127', 'GST06GGNAB5678G7Z7', ARRAY['BOPP Tapes', 'Shipping Bags'], 'medium', '500 rolls', 'Gurugram', 'Haryana', 'Sector 29, Gurugram', 'approved', ARRAY['verified'], 'Waterproof labels and brown tape bulk', NOW(), NOW()),
(gen_random_uuid(), 'GGN QuickWrap', 'ggnquickwrap@test.com', '$2a$10$test', '+91-9000000128', 'GST06GGNAC9012H8Z8', ARRAY['Bubble Wrap', 'Shipping Bags'], 'medium', '10 rolls', 'Gurugram', 'Haryana', 'Sector 14, Gurugram', 'approved', ARRAY['verified','gst'], 'Stretch film and cling film rolls', NOW(), NOW()),
(gen_random_uuid(), 'Gurgaon Mail Solutions', 'ggnmailsol@test.com', '$2a$10$test', '+91-9000000129', 'GST06GGNAB3456I9Z9', ARRAY['Shipping Bags', 'Paper Cups'], 'small', '500 mailers', 'Gurugram', 'Haryana', 'Sohna Road, Gurugram', 'approved', ARRAY['verified'], 'Padded mailers and event cups', NOW(), NOW()),
(gen_random_uuid(), 'GGN Specialty Boxes', 'ggnspecialty@test.com', '$2a$10$test', '+91-9000000130', 'GST06GGNAC7890J1Z1', ARRAY['Corrugated Boxes'], 'large', '25 boxes', 'Gurugram', 'Haryana', 'Golf Course Road, Gurugram', 'approved', ARRAY['verified','gst','premium'], 'Rigid gift boxes with velvet and magnet lock', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ############################################
-- Summary: 30 suppliers across 3 cities
-- - Lucknow: 10 suppliers
-- - Noida/Greater Noida: 10 suppliers  
-- - Gurugram: 10 suppliers
-- Products covered: All 5 categories
-- ############################################

-- Verify counts
-- SELECT city, COUNT(*) FROM suppliers GROUP BY city;
-- SELECT unnest("productCategories") as category, COUNT(*) FROM suppliers GROUP BY category;
