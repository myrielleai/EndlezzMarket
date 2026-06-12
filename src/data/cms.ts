import { Product, BlogPost, LookbookItem, Review } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Blue Grid Cropped Polo',
    description: 'A sleek, structured crop polo featuring clean grid symmetry and absolute breathing comfort. Perfect for an elevated urban minimalist look. Part of our structural Grid Collection.',
    price: 420.90,
    status: 'new',
    collection: 'grid',
    image_url: '/img/products/img-1.jpg',
    image_hover_url: '/img/products/img-9.jpg',
    stock: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    size_stock: { S: 10, M: 8, L: 5, XL: 2 }
  },
  {
    id: 'prod-2',
    name: 'White Minimalist Cropped Polo',
    description: 'Timeless, clean silhouette in absolute off-white tone. The epitome of modern street silence. High-quality fabric blends durability and lightweight breathability.',
    price: 420.90,
    status: 'sale',
    collection: 'minimalist',
    image_url: '/img/products/img-2.jpg',
    image_hover_url: '/img/products/img-10.jpg',
    stock: 12,
    sizes: ['S', 'M', 'L', 'XL'],
    size_stock: { S: 3, M: 4, L: 5, XL: 0 }
  },
  {
    id: 'prod-3',
    name: 'Green Grid Cropped Polo',
    description: 'Earthy tone structured clothing inspired by symmetrical grid formats. Featuring subtle contrasting lines and comfortable drop shoulders.',
    price: 420.90,
    status: 'new',
    collection: 'grid',
    image_url: '/img/products/img-3.jpg',
    image_hover_url: '/img/products/img-1.jpg',
    stock: 15,
    sizes: ['S', 'M', 'L'],
    size_stock: { S: 5, M: 5, L: 5 }
  },
  {
    id: 'prod-4',
    name: 'Black Minimalist Cropped Polo',
    description: 'A dark, brooding staple cropped polo. High-contrast resilience identity in a clean finish. Easy to layer, engineered for daily active performance.',
    price: 420.90,
    status: 'popular',
    collection: 'minimalist',
    image_url: '/img/products/img-4.jpg',
    image_hover_url: '/img/products/img-2.jpg',
    stock: 30,
    sizes: ['S', 'M', 'L', 'XL'],
    size_stock: { S: 10, M: 10, L: 8, XL: 2 }
  },
  {
    id: 'prod-5',
    name: 'Light Blue Minimalist Cropped Polo',
    description: 'Soft pastel blue silhouette that embraces the subtle details of minimalist garments. Built to endure, tailored for relaxed styling.',
    price: 420.90,
    status: 'new',
    collection: 'minimalist',
    image_url: '/img/products/img-5.jpg',
    image_hover_url: '/img/products/img-8.jpg',
    stock: 8,
    sizes: ['S', 'M', 'L'],
    size_stock: { S: 4, M: 2, L: 2 }
  },
  {
    id: 'prod-6',
    name: 'Green Lining Cropped Polo',
    description: 'Featuring distinctive contrasting green sleeve and hem linings. High street aesthetic combined with athletic fit constraints.',
    price: 420.90,
    status: 'sale',
    collection: 'grid',
    image_url: '/img/products/img-6.jpg',
    image_hover_url: '/img/products/img-3.jpg',
    stock: 14,
    sizes: ['S', 'M', 'L', 'XL'],
    size_stock: { S: 2, M: 5, L: 4, XL: 3 }
  },
  {
    id: 'prod-7',
    name: 'Black Lining Angel Polo',
    description: 'Flowy, ethereal drape with thick black contrast borders. Celebrating grace and structure in alignment with the Angel Collection values.',
    price: 420.90,
    status: 'new',
    collection: 'angel',
    image_url: '/img/products/img-7.jpg',
    image_hover_url: '/img/products/img-11.jpg',
    stock: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    size_stock: { S: 5, M: 5, L: 5, XL: 3 }
  },
  {
    id: 'prod-8',
    name: 'Blue Lining Angel Polo',
    description: 'Graceful aesthetic with vibrant blue lining accents. Flowy soft drape cut meant to deliver ultimate lightweight freedom of movement.',
    price: 420.90,
    status: 'sale',
    collection: 'angel',
    image_url: '/img/products/img-11.jpg',
    image_hover_url: '/img/products/img-7.jpg',
    stock: 5,
    sizes: ['S', 'M', 'L'],
    size_stock: { S: 2, M: 2, L: 1 }
  },
  {
    id: 'prod-9',
    name: 'Dark Blue Grid Cropped Polo',
    description: 'Deep indigo tone grid pattern garment. Made of durable knit cotton that retains form while resisting standard wear and tear.',
    price: 420.90,
    status: 'new',
    collection: 'grid',
    image_url: '/img/products/img-12.jpg',
    image_hover_url: '/img/products/img-13.jpg',
    stock: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    size_stock: { S: 6, M: 8, L: 5, XL: 3 }
  },
  {
    id: 'prod-10',
    name: 'Red Minimalist Cropped Polo',
    description: 'A bold fire red expression of minimalist streetwear design. Retaining structural shape across a double-stitched cotton blend.',
    price: 420.90,
    status: 'sale',
    collection: 'minimalist',
    image_url: '/img/products/img-14.jpg',
    image_hover_url: '/img/products/img-15.jpg',
    stock: 0, // Out of stock for testing waitlists
    sizes: ['S', 'M', 'L', 'XL'],
    size_stock: { S: 0, M: 0, L: 0, XL: 0 }
  },
  {
    id: 'prod-11',
    name: 'Green Minimalist Cropped Polo',
    description: 'Forest green cotton blend crop. Understated design, breathable texture, and custom rib-knit collars that stay crisp.',
    price: 420.90,
    status: 'new',
    collection: 'minimalist',
    image_url: '/img/products/img-15.jpg',
    image_hover_url: '/img/products/img-14.jpg',
    stock: 19,
    sizes: ['S', 'M', 'L', 'XL'],
    size_stock: { S: 5, M: 5, L: 5, XL: 4 }
  },
  {
    id: 'prod-12',
    name: 'Light Blue Grid Cropped Polo',
    description: 'Clean light wash grid cropped polo. Premium materials engineered for high resilience and long-lasting freshness.',
    price: 420.90,
    status: 'new',
    collection: 'grid',
    image_url: '/img/products/img-13.jpg',
    image_hover_url: '/img/products/img-12.jpg',
    stock: 8,
    sizes: ['S', 'M', 'L'],
    size_stock: { S: 3, M: 3, L: 2 }
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: '"Endlezz Fits, Endlezz Drip”: How to Rock Your Endlezz Shirts for Any Occasion',
    excerpt: 'Streetwear isn’t just for the street. Learn how to style your structured cropped polos for casual nights, academic settings, and premium functions.',
    content: `Streetwear is no longer confined to the sidelines of fashion—it has taken center stage. The Endlezz cropped polo series bridges the gap between active functional gear and structural high-fashion aesthetics.

    Here are three ways to style your Endlezz shirts:
    
    1. The Clean Academic: Pair the White Minimalist Cropped Polo with wide-leg beige chinos and clean white sneakers. Layer with a minimal silver chain to hold structure without noise.
    2. The Brutalist Nightout: Match the Black Minimalist Cropped Polo with relaxed black cargo trousers and utility combat boots. Throw on an oversized denim or leather jacket to project effortless presence.
    3. The Dynamic Grid: Utilize the Blue Grid Cropped Polo with charcoal grey trousers or structured shorts. The grid pattern gives automatic visual depth, meaning you can keep the rest of the outfit completely muted.
    
    Remember: discipline lies in the details. Keep it tidy, keep it silent, and let the silhouettes speak.`,
    imageUrl: '/img/other/img8.jpeg',
    date: 'March 02, 2025',
    slug: 'endlezz-fits-endlezz-drip-style-guide',
    readTime: '4 min read'
  },
  {
    id: 'post-2',
    title: 'Endlezz Possibilities: How Our Shirts Let You Wear Your Story',
    excerpt: 'Our garments act as blank canvases for personal resilience. Explore the connection between physical discipline and minimalist wardrobe design.',
    content: `Clothes are more than utility; they are extensions of our current state of mind. At Endlezz, every stitch is designed around the philosophy of endurance.
    
    In a world filled with endless background noise, choosing minimalist design is a statement of power. It represents silence. It signifies that your path is determined by your internal drive, not the opinions of others.
    
    Our fabric selection consists of a heavily combed cotton and polyester weave that resists warping, shrinking, and wear. This represents resilience. We design garments that stand up to the elements of everyday grind, serving as your uniform for long hours of study, work, or gym transformation.
    
    When you wear Endlezz, you wear your discipline.`,
    imageUrl: '/img/other/img5.jpeg',
    date: 'March 02, 2025',
    slug: 'endlezz-possibilities-wear-your-story',
    readTime: '3 min read'
  },
  {
    id: 'post-3',
    title: 'From Doodles to Drip: The Endlezz Design Journey',
    excerpt: 'Behind the scenes at the design table. Take an exclusive look at our structural drafting, fabric test cycles, and aesthetic refinement steps.',
    content: `Every single polo starts as a geometry sketch on a gridded desk. Inspired by brutalist structural architectural layouts and street culture dynamics, we drafted over thirty fits before finalizing the Endlezz Cropped Polo sleeve length, chest volume, and hem drops.
    
    We wanted a garment that emphasizes shoulder breadth while falling at the natural waistline. This gives a boxy silhouette that fits all body types with clean lines.
    
    Next came color pairing. We rejected hyper-bright standard pigments and focused on curated tones: steel blues, pine greens, muted off-whites, and deep blacks. We then added signature accents: high-contrast linings and precise embroidery details.
    
    The final product is a result of tireless feedback, testing, and absolute discipline. We don't release trends—we release armor.`,
    imageUrl: '/img/other/img4.JPG',
    date: 'March 02, 2025',
    slug: 'from-doodles-to-drip-design-journey',
    readTime: '5 min read'
  }
];

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'lookbook-1',
    title: 'Structural Silence',
    imageUrl: '/img/other/img1.JPG',
    description: 'Black Minimalist cropped polo styled alongside structural brutalist columns. Emphasizing clean shoulders and strict silhouettes.',
    collection: 'Minimalist'
  },
  {
    id: 'lookbook-2',
    title: 'Symmetrical Grid',
    imageUrl: '/img/other/img2.JPG',
    description: 'Blue Grid cropped polo showcasing geometric alignment and boxy structural drape in natural afternoon lighting.',
    collection: 'Grid'
  },
  {
    id: 'lookbook-3',
    title: 'Ethereal Grace',
    imageUrl: '/img/other/img3.JPG',
    description: 'Black Lining Angel polo expressing movement and fluidity against organic concrete textures. Soft yet resilient.',
    collection: 'Angel'
  },
  {
    id: 'lookbook-4',
    title: 'Raw Resilience',
    imageUrl: '/img/other/img7.jpeg',
    description: 'Lifestyle action capture displaying garment breathability and active performance utility in urban environments.',
    collection: 'Minimalist'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Chad Jer',
    rating: 5,
    text: 'I absolutely love the quality of the clothes from this store! The fabric is soft, and the fit is perfect. Highly recommend!',
    createdAt: '2025-05-10T10:00:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-4',
    userName: 'Sean',
    rating: 5,
    text: 'Ayos pwede pala ko mag model nito hehehe angas nito worth it sa price !!!',
    createdAt: '2025-05-12T14:30:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'Gian Andre',
    rating: 5,
    text: 'I was amazed at how comfortable the clothes are. I got compliments all day when I wore my new polo. Great value for money!',
    createdAt: '2025-05-15T09:15:00Z'
  }
];

export const ATHLETE_FEATURES = [
  {
    id: 'athlete-1',
    name: 'Karl Jerusalem',
    discipline: 'Powerlifting & Functional Training',
    quote: 'True strength is built in absolute silence. When you stop listening to the noise, your resilience speaks for itself.',
    story: 'Karl is a collegiate powerlifter who dedicates 4 hours every day to strength training while maintaining high academic performance. For Karl, Endlezz is the perfect intersection of physical performance wear and boxy streetwear style.',
    imageUrl: '/img/other/img6.jpeg'
  },
  {
    id: 'athlete-2',
    name: 'Sofia Aldea',
    discipline: 'Contemporary Movement & Street Dance',
    quote: 'The body flows where structure permits. The lines of the Angel Collection allow me to express fluidity without constraints.',
    story: 'Sofia is a dancer who blends brutalist, aggressive movement with soft classical flow. She uses Endlezz shirts as her daily studio armor, expressing shape and structural elegance through dynamic choreographies.',
    imageUrl: '/img/other/img1.JPG'
  }
];

export const TRANSFORMATION_STORIES = [
  {
    id: 'transform-1',
    author: 'Mark De Leon',
    title: 'From Sloth to Discipline',
    content: 'Reclaiming my focus started with structured routines. I stripped away unnecessary details in my training, my diet, and my wardrobe. The Minimalist Collection represents this shift—fewer distractions, higher quality.',
    rating: 5
  },
  {
    id: 'transform-2',
    author: 'Chloe Sy',
    title: 'The Resilience of Consistency',
    content: 'Progress is not a straight line. It is a daily choice to show up. I wear the Endlezz Grid collection because its geometric perfection reminds me that structure breeds freedom and growth.',
    rating: 5
  }
];
