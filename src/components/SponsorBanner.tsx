import nccLogo from "@/assets/ncc-sponsor.png";

const SponsorBanner = () => {
  return (
    <a 
      href="https://ncc.gov.ng" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow duration-200"
    >
      <img 
        src={nccLogo} 
        alt="Nigerian Communications Commission" 
        className="h-16 w-auto object-contain"
      />
    </a>
  );
};

export default SponsorBanner;
