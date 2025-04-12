interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  popular?: boolean;
  onCtaClick: () => void;
}

export default function ServiceCard({
  title,
  description,
  features,
  popular = false,
  onCtaClick,
}: ServiceCardProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-md p-5">
      {popular && (
        <div className="text-primary text-xs font-bold mb-2">
          POPULAR CHOICE
        </div>
      )}
      <h3 className="text-xl font-bold text-primary mb-2">
        {title}
      </h3>
      <p className="text-neutral-600 mb-4">{description}</p>
      <ul className="mb-5 space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span className="text-neutral-600">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onCtaClick}
        className="w-full text-center bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition duration-300"
      >
        Get Started
      </button>
    </div>
  );
}
