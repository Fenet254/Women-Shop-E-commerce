// Product data for Girls Shop E-Commerce
const products = [
  // Dresses
  { id: 1, name: "Elegant Red Dress", price: 89.99, image: "../image/dressimage/dress.png", category: "dresses", description: "Stunning red dress perfect for parties." },
  { id: 2, name: "Summer Floral Dress", price: 59.99, image: "../image/dressimage/dress1.png", category: "dresses", description: "Light floral dress for summer outings." },
  { id: 3, name: "Black Evening Dress", price: 129.99, image: "../image/dressimage/dress2.png", category: "dresses", description: "Sophisticated black dress for evenings." },
  { id: 4, name: "Casual Blue Dress", price: 49.99, image: "../image/dressimage/dress3.png", category: "dresses", description: "Comfortable blue dress for daily wear." },
  { id: 5, name: "Vintage Pink Dress", price: 79.99, image: "../image/dressimage/dress4.png", category: "dresses", description: "Vintage-inspired pink dress." },
  { id: 6, name: "Maxi Green Dress", price: 99.99, image: "../image/dressimage/dress5.png", category: "dresses", description: "Flowy green maxi dress." },
  { id: 7, name: "Chic White Dress", price: 69.99, image: "../image/dressimage/dress6.png", category: "dresses", description: "Chic white dress for any occasion." },
  { id: 8, name: "Bohemian Yellow Dress", price: 54.99, image: "../image/dressimage/dress7.png", category: "dresses", description: "Bohemian style yellow dress." },
  { id: 9, name: "Sleeveless Purple Dress", price: 64.99, image: "../image/dressimage/dress8.png", category: "dresses", description: "Sleeveless purple dress." },
  { id: 10, name: "Classic Black Dress", price: 84.99, image: "../image/dressimage/dress9.png", category: "dresses", description: "Timeless classic black dress." },
  { id: 11, name: "Off-Shoulder Dress", price: 74.99, image: "../image/dressimage/dress10.png", category: "dresses", description: "Trendy off-shoulder dress." },

  // Skirts
  { id: 12, name: "Pleated Mini Skirt", price: 39.99, image: "../image/skirtimage/skirt1.png", category: "skirts", description: "Cute pleated mini skirt." },
  { id: 13, name: "Denim Midi Skirt", price: 49.99, image: "../image/skirtimage/skirt2.png", category: "skirts", description: "Stylish denim midi skirt." },
  { id: 14, name: "Leather Pencil Skirt", price: 79.99, image: "../image/skirtimage/skirt3.png", category: "skirts", description: "Edgy leather pencil skirt." },
  { id: 15, name: "Floral A-Line Skirt", price: 44.99, image: "../image/skirtimage/skirt4.png", category: "skirts", description: "Floral A-line skirt." },
  { id: 16, name: "High-Waisted Skirt", price: 54.99, image: "../image/skirtimage/skirt5.png", category: "skirts", description: "High-waisted skirt for fashion." },
  { id: 17, name: "Tulle Tutu Skirt", price: 34.99, image: "../image/skirtimage/skirt7.png", category: "skirts", description: "Fun tulle tutu skirt." },
  { id: 18, name: "Wrap Skirt", price: 59.99, image: "../image/skirtimage/skirt8.png", category: "skirts", description: "Elegant wrap skirt." },
  { id: 19, name: "Chiffon Skirt", price: 49.99, image: "../image/skirtimage/skirt9.png", category: "skirts", description: "Light chiffon skirt." },
  { id: 20, name: "Asymmetrical Skirt", price: 64.99, image: "../image/skirtimage/skirt10.png", category: "skirts", description: "Modern asymmetrical skirt." },
  { id: 21, name: "Velvet Skirt", price: 69.99, image: "../image/skirtimage/skirt11.png", category: "skirts", description: "Luxurious velvet skirt." },
  { id: 22, name: "Cargo Skirt", price: 59.99, image: "../image/skirtimage/skirt12.png", category: "skirts", description: "Practical cargo skirt." },
  { id: 23, name: "Maxi Skirt", price: 74.99, image: "../image/skirtimage/skirt13.png", category: "skirts", description: "Flowy maxi skirt." },

  // Suits
  { id: 24, name: "Tailored Blazer Suit", price: 149.99, image: "../image/suitimage/suit1.png", category: "suits", description: "Professional tailored blazer suit." },
  { id: 25, name: "Pinstripe Suit", price: 179.99, image: "../image/suitimage/suit2.png", category: "suits", description: "Classic pinstripe suit." },
  { id: 26, name: "Velvet Suit", price: 199.99, image: "../image/suitimage/suit3.png", category: "suits", description: "Luxurious velvet suit." },
  { id: 27, name: "Casual Suit", price: 129.99, image: "../image/suitimage/suit4.png", category: "suits", description: "Casual yet elegant suit." },
  { id: 28, name: "Two-Piece Suit", price: 159.99, image: "../image/suitimage/suit5.png", category: "suits", description: "Versatile two-piece suit." },
  { id: 29, name: "Jumpsuit Suit", price: 139.99, image: "../image/suitimage/suit6.png", category: "suits", description: "Modern jumpsuit suit." },
  { id: 30, name: "Tuxedo Suit", price: 249.99, image: "../image/suitimage/suit7.png", category: "suits", description: "Formal tuxedo suit." },
  { id: 31, name: "Skirt Suit", price: 169.99, image: "../image/suitimage/suit8.png", category: "suits", description: "Chic skirt suit." },
  { id: 32, name: "Pant Suit", price: 189.99, image: "../image/suitimage/suit9.png", category: "suits", description: "Professional pant suit." },

  // Pajamas
  { id: 33, name: "Black Pajama Set", price: 29.99, image: "../image/pjamaimage/black-pjama.png", category: "pajamas", description: "Comfortable black pajama set." },
  { id: 34, name: "Blue Pajama Set", price: 29.99, image: "../image/pjamaimage/blue-pjama.png", category: "pajamas", description: "Cozy blue pajama set." },
  { id: 35, name: "Pink Pajama Set", price: 29.99, image: "../image/pjamaimage/pink-pijama.png", category: "pajamas", description: "Adorable pink pajama set." },

  // Additional categories (using other images if available, or placeholders)
  // For shoes, jewelry, bags, makeup, human-hair: Since no specific images, use placeholders or skip for now, focus on fashion.
  // To expand, add more with fake images or use existing.
  // For uniqueness, add more dresses/skirts.
  { id: 36, name: "Designer Dress", price: 199.99, image: "../image/dressimage/dress.png", category: "dresses", description: "Exclusive designer dress." },
  { id: 37, name: "Party Skirt", price: 89.99, image: "../image/skirtimage/skirt1.png", category: "skirts", description: "Sparkly party skirt." },
  { id: 38, name: "Business Suit", price: 219.99, image: "../image/suitimage/suit1.png", category: "suits", description: "Power business suit." },
  { id: 39, name: "Silk Pajamas", price: 49.99, image: "../image/pjamaimage/pink-pijama.png", category: "pajamas", description: "Luxury silk pajamas." },
  // Add up to 50+ by duplicating with variations.
  { id: 40, name: "Romantic Dress", price: 109.99, image: "../image/dressimage/dress3.png", category: "dresses", description: "Romantic lace dress." },
  { id: 41, name: "Sporty Skirt", price: 39.99, image: "../image/skirtimage/skirt4.png", category: "skirts", description: "Sporty mini skirt." },
  { id: 42, name: "Wedding Suit", price: 299.99, image: "../image/suitimage/suit7.png", category: "suits", description: "Elegant wedding suit." },
  { id: 43, name: "Cotton Pajamas", price: 24.99, image: "../image/pjamaimage/blue-pjama.png", category: "pajamas", description: "Soft cotton pajamas." },
  { id: 44, name: "Gothic Dress", price: 119.99, image: "../image/dressimage/dress9.png", category: "dresses", description: "Edgy gothic dress." },
  { id: 45, name: "Beach Skirt", price: 49.99, image: "../image/skirtimage/skirt10.png", category: "skirts", description: "Light beach skirt." },
  { id: 46, name: "Casual Suit", price: 139.99, image: "../image/suitimage/suit4.png", category: "suits", description: "Relaxed casual suit." },
  { id: 47, name: "Satin Pajamas", price: 39.99, image: "../image/pjamaimage/black-pjama.png", category: "pajamas", description: "Shiny satin pajamas." },
  { id: 48, name: "Vintage Dress", price: 99.99, image: "../image/dressimage/dress5.png", category: "dresses", description: "Retro vintage dress." },
  { id: 49, name: "Tulle Skirt", price: 59.99, image: "../image/skirtimage/skirt7.png", category: "skirts", description: "Poofy tulle skirt." },
  { id: 50, name: "Executive Suit", price: 259.99, image: "../image/suitimage/suit2.png", category: "suits", description: "Executive power suit." },
  { id: 51, name: "Flannel Pajamas", price: 34.99, image: "../image/pjamaimage/pink-pijama.png", category: "pajamas", description: "Warm flannel pajamas." },

  // Shoes
  { id: 52, name: "Red Heels", price: 79.99, image: "../six.png", category: "shoes", description: "Classic red high heels." },
  { id: 53, name: "White Sneakers", price: 59.99, image: "../seven.png", category: "shoes", description: "Comfortable white sneakers." },
  { id: 54, name: "Black Boots", price: 99.99, image: "../eight.png", category: "shoes", description: "Stylish black boots." },
  { id: 55, name: "Sandals", price: 39.99, image: "../nine.png", category: "shoes", description: "Summer sandals." },
  { id: 56, name: "Loafers", price: 69.99, image: "../ten.png", category: "shoes", description: "Elegant loafers." },

  // Jewelry
  { id: 57, name: "Gold Necklace", price: 49.99, image: "../eleven.png", category: "jewelry", description: "Shiny gold necklace." },
  { id: 58, name: "Diamond Earrings", price: 129.99, image: "../back.png", category: "jewelry", description: "Sparkling diamond earrings." },
  { id: 59, name: "Silver Bracelet", price: 34.99, image: "../bottoms.png", category: "jewelry", description: "Delicate silver bracelet." },
  { id: 60, name: "Pearl Ring", price: 89.99, image: "../ff.png", category: "jewelry", description: "Elegant pearl ring." },
  { id: 61, name: "Hoop Earrings", price: 59.99, image: "../fifteen.png", category: "jewelry", description: "Trendy hoop earrings." },

  // Bags
  { id: 62, name: "Leather Handbag", price: 119.99, image: "../fine.png", category: "bags", description: "Luxury leather handbag." },
  { id: 63, name: "Tote Bag", price: 49.99, image: "../foutheen.png", category: "bags", description: "Practical tote bag." },
  { id: 64, name: "Clutch Purse", price: 79.99, image: "../ii.png", category: "bags", description: "Evening clutch purse." },
  { id: 65, name: "Backpack", price: 89.99, image: "../seventeen.png", category: "bags", description: "Stylish backpack." },
  { id: 66, name: "Crossbody Bag", price: 69.99, image: "../seventen.png", category: "bags", description: "Convenient crossbody bag." },

  // Makeup
  { id: 67, name: "Red Lipstick", price: 19.99, image: "../sixteen.png", category: "makeup", description: "Bold red lipstick." },
  { id: 68, name: "Foundation", price: 29.99, image: "../thirteen.png", category: "makeup", description: "Natural foundation." },
  { id: 69, name: "Eyeshadow Palette", price: 39.99, image: "../twelve.png", category: "makeup", description: "Versatile eyeshadow palette." },
  { id: 70, name: "Mascara", price: 24.99, image: "../twen.png", category: "makeup", description: "Lengthening mascara." },
  { id: 71, name: "Blush", price: 22.99, image: "../twtw.png", category: "makeup", description: "Rosy blush." },

  // Human Hair
  { id: 72, name: "Straight Wig", price: 99.99, image: "../one.png", category: "human-hair", description: "Natural straight wig." },
  { id: 73, name: "Curly Extensions", price: 79.99, image: "../two.png", category: "human-hair", description: "Beautiful curly extensions." },
  { id: 74, name: "Bob Wig", price: 89.99, image: "../three.png", category: "human-hair", description: "Chic bob wig." },
  { id: 75, name: "Lace Frontal", price: 119.99, image: "../four.png", category: "human-hair", description: "Premium lace frontal." },
  { id: 76, name: "Braided Hair", price: 69.99, image: "../five.png", category: "human-hair", description: "Stylish braided hair." },
];

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}
