import { ShieldCheck } from "lucide-react";

type RiderProfileSectionProps = {
  picture: string;
  mobile: string;
  isVerified: boolean;
  aadhaarNumber: string;
  drivingLicenceNumber: string;
  isAvailable: boolean;
  onToggleAvailability: () => void;
};

export default function RiderProfileSection({
  picture,
  mobile,
  isVerified,
  aadhaarNumber,
  drivingLicenceNumber,
  isAvailable,
  onToggleAvailability,
}: RiderProfileSectionProps) {
  return (
    <section className="space-y-4 rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-divider">
      <div className="flex items-center gap-4">
        <img
          src={picture}
          alt="rider"
          className="h-16 w-16 rounded-full object-cover"
        />

        <div>
          <p className="text-sm font-semibold text-charcoal">{mobile}</p>

          <p className="mt-1 flex items-center gap-1 text-[11px] text-text-secondary">
            <ShieldCheck
              className={`h-3.5 w-3.5 ${
                isVerified ? "text-success" : "text-text-secondary"
              }`}
            />
            {isVerified ? "Verified partner" : "Verification pending"}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs text-text-secondary">
        <div className="flex items-center justify-between rounded-2xl bg-bg-blush px-3 py-2">
          <span className="font-medium">Aadhaar</span>
          <span className="font-semibold">****{aadhaarNumber.slice(-4)}</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-bg-blush px-3 py-2">
          <span className="font-medium">Driving licence</span>
          <span className="font-semibold">
            ****{drivingLicenceNumber.slice(-4)}
          </span>
        </div>
      </div>

      <button onClick={onToggleAvailability} className="btn-primary mt-3">
        {isAvailable ? "Go offline" : "Go online"}
      </button>
    </section>
  );
}

