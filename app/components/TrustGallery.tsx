import Image from 'next/image';

export default function TrustGallery() {
  return (
    <section className="trust-gallery">
      <div className="container">
        <div className="section-label" style={{ textAlign: 'center' }}>Proven Record</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Delivered with <span className="gradient-text">Care</span></h2>
        
        <div className="gallery-grid">
          <div className="gallery-item" data-aos="zoom-in">
            <Image
              src="/images/customer.png"
              alt="Happy Customer Delivery"
              width={600}
              height={500}
              style={{ width: '100%', height: '100%', objectFit: 'cover', userSelect: 'none', pointerEvents: 'none' }}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
            <div className="gallery-overlay">
              <p><i className="fa-solid fa-circle-check"></i> Fresh Food Delivery</p>
            </div>
          </div>
          <div className="gallery-item" data-aos="zoom-in" data-aos-delay="100">
            <Image
              src="/images/customer2.png"
              alt="Safe Cake Delivery"
              width={600}
              height={500}
              style={{ width: '100%', height: '100%', objectFit: 'cover', userSelect: 'none', pointerEvents: 'none' }}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
            <div className="gallery-overlay">
              <p><i className="fa-solid fa-circle-check"></i> Cake & Desserts Safe</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
