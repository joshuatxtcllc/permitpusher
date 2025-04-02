interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  features: string[];
  popular?: boolean;
  onCtaClick: () => void;
}

export default function ServiceCard({
  title,
  description,
  image,
  imageAlt,
  features,
  popular = false,
  onCtaClick,
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="h-48 bg-primary-light relative">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
        {popular && (
          <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
            Most Popular
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary font-heading mb-2">
          {title}
        </h3>
        <p className="text-neutral-600 mb-4">{description}</p>
        <ul className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-success mt-1 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onCtaClick}
          className="block text-center bg-primary hover:bg-primary/80 text-white font-medium py-2 px-4 rounded-md transition duration-300 w-full"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
