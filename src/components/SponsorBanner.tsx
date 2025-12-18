import nccLogo from "@/assets/ncc-sponsor.png";

const SponsorBanner = () => {
  return (
    <div className="w-full bg-white border-b border-gray-200 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="text-sm text-gray-600 font-medium">Sponsored by:</span>
        <img 
          src={nccLogo} 
          alt="Nigerian Communications Commission" 
          className="h-10 object-contain"
        />
      </div>
    </div>
  );
};

export default SponsorBanner;
