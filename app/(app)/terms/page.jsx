import SiteLayout from "@/app/components/layout/SiteLayout";

const Terms = () => {
  return (
    <div className="luxury-page py-12">
      <div className="luxury-container">
        <div className="luxury-surface max-w-4xl p-8 sm:p-10">
          <h1 className="mb-8 text-center font-display text-3xl font-semibold text-luxury-black sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mb-6 text-luxury-charcoal/85">
            At Moinabad Farmstays, managed by Easy Minds Services Pvt Ltd we value your privacy. This policy outlines how we collect, use, and protect your information.
          </p>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            1. Information We Collect
          </h2>
          <p className="mb-4 text-luxury-charcoal/85">
            <strong>Personal Info:</strong> Name, address, email, phone number, and social media profiles when you register or use our services.
          </p>
          <p className="mb-4 text-luxury-charcoal/85">
            <strong>Automatic Info:</strong> IP address, browser type, and browsing behavior.
          </p>
          <p className="mb-4 text-luxury-charcoal/85">
            <strong>Cookies:</strong> Used to enhance your experience and remember preferences. You can manage cookies via your browser settings.profiles. Providing this information helps us customize and improve your experience.
          </p>
          <p className="mb-4 text-luxury-charcoal/85">
            <strong>Automatic Information:</strong> We collect certain information automatically, including your IP address, browser type, device information, and browsing behavior on our platform. This helps us analyze user trends and improve our services.
          </p>
          <p className="mb-6 text-luxury-charcoal/85">
            <strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience, remember your preferences, and gather analytical data. You can manage your cookie preferences through your browser settings; however, disabling cookies may affect certain functionalities of our website.
          </p>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            Location-Based Services
          </h2>
          <p className="mb-6 text-luxury-charcoal/85">
            We do not collect or store your location data. However, our platform may request access to your location on your device to show nearby farmhouses and improve your experience. This access is entirely controlled by you and can be managed through your device settings.
          </p>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            How We Use Your Information
          </h2>
          <ul className="mb-6 list-inside list-disc space-y-2 text-luxury-charcoal/85">
            <li>To improve and personalize our services.</li>
            <li>To communicate updates, offers, and promotions.</li>
            <li>To enhance security and prevent fraud.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            Sharing Information
          </h2>
          <ul className="mb-6 list-inside list-disc space-y-2 text-luxury-charcoal/85">
            <li><strong>With Partners:</strong> Shared with trusted affiliates for related services.</li>
            <li><strong>Legal Compliance:</strong> Disclosed if required by law.</li>
            <li><strong>Business Transfers:</strong> Transferred in the event of a merger or sale with another entity.</li>
          </ul>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            Third-Party Links
          </h2>
          <p className="mb-6 text-luxury-charcoal/85">
            We are not responsible for the privacy practices of third-party sites linked from our platform.
          </p>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            Your Rights
          </h2>
          <ul className="mb-6 list-inside list-disc space-y-2 text-luxury-charcoal/85">
            <li><strong>Access & Update:</strong> Modify your personal info via account settings.</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from promotional emails anytime.</li>
            <li><strong>Cookie Preferences:</strong> Manage via your browser.</li>
          </ul>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            Consent
          </h2>
          <p className="mb-6 text-luxury-charcoal/85">
            By using MaaBooking, you agree to this policy.
          </p>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            Governing Law
          </h2>
          <p className="mb-6 text-luxury-charcoal/85">
            This policy is governed by Indian laws, subject to Arbitration and Conciliation Act, Sole Arbitrator to be appointed by the MaaBooking, and Arbitration proceedings to be conducted in Ranga Reddy District, Hyderabad, Telangana State.
          </p>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            Account Deletion
          </h2>
          <p className="mb-6 text-luxury-charcoal/85">
            To request the deletion of your account and all associated data, please send an email to contact@maabooking.com. We will process your request in accordance with our privacy policy and applicable data protection regulations.
          </p>

          <h2 className="mb-4 font-display text-xl font-semibold text-luxury-black sm:text-2xl">
            Contact Us
          </h2>
          <p className="mb-4 text-luxury-charcoal/85">
            <strong>Easy Minds Services Pvt. Ltd.</strong>
          </p>
          <p className="mb-2 text-luxury-charcoal/85">
            <strong>Mobile:</strong> 7674040033
          </p>
          <p className="text-luxury-charcoal/85">
            <strong>Email:</strong> Contact@maabooking.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default function TermsPage() {
  return (
    <SiteLayout>
      <Terms />
    </SiteLayout>
  );
}
