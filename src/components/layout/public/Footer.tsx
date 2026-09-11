export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full h-16 border border-t flex items-center justify-center">
      <h1>
        copyright &copy; {currentYear} PH Healthcare. All rights reserved.
      </h1>
    </div>
  );
}
