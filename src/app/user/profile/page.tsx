"use client";

const InfoSection = () => {
  return (
    <div>
      <p>Info</p>
    </div>
  );
}

const PasswordSection = () => {
  return (
    <div>
      <p>Password</p>
    </div>
  );
}

const ReviewSection = () => {
  return (
    <div>
      <p>Review</p>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <div className="min-h-screen bg-light">
          <div className="flex flex-col md:flex-row">
            <InfoSection />
            <PasswordSection />
            <ReviewSection />
          </div>
      </div>
    </div>
  );
}
