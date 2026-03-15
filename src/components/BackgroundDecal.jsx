export default function BackgroundDecal() {
  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          backgroundImage: `url("/bg_room.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(120%) brightness(50%) sepia(50%) hue-rotate(300deg) saturate(150%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Vignette Overlay for Depth */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at center, transparent 30%, #080000 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
