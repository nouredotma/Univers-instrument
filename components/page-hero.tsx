import { Container } from "@/components/ui/container"

interface PageHeroProps {
  title: string
  backgroundImage: string
  showOverlay?: boolean
}

export default function PageHero({ title, backgroundImage, showOverlay = true }: PageHeroProps) {
  // Ensure we have a valid image URL
  const imageUrl = backgroundImage && backgroundImage !== '/placeholder.svg' && backgroundImage !== '/placeholder.jpg'
    ? backgroundImage 
    : '/placeholder.jpg'
  
  // Add cache busting for localhost URLs to force refresh
  const finalImageUrl = imageUrl && imageUrl.includes('localhost:3030')
    ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${Date.now()}`
    : imageUrl
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🎨 PageHero image:', { title, backgroundImage, imageUrl, finalImageUrl, showOverlay })
  }
  
  return (
    <section className="relative h-[50dvh] md:h-[60dvh] w-full flex items-end overflow-hidden bg-muted">
      {/* Background Image */}
      {finalImageUrl && (
        <img
          key={finalImageUrl} // Force re-render when URL changes
          src={finalImageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('❌ Image failed to load:', finalImageUrl)
            const target = e.target as HTMLImageElement
            target.src = '/placeholder.jpg'
          }}
          onLoad={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Image loaded successfully:', finalImageUrl)
            }
          }}
        />
      )}
      
      {/* Dark overlay for better text readability - conditionally rendered */}
      {showOverlay && (
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/5 z-10" />
      )}
      
      {/* Content */}
      <Container className="relative z-20 max-w-7xl mx-auto pb-8 px-4">
        <h1 className="text-xl md:text-3xl font-bold font-trajan-pro uppercase tracking-wider text-white drop-shadow-lg">{title}</h1>
      </Container>
    </section>
  )
}
