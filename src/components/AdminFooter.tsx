"use client";

export default function AdminFooter() {
  return (
    <footer className="bg-white border-t border-[#caf0f8] py-6 mt-12">
      <div className="max-w-[1600px] mx-auto px-4">
        <p className="text-sm text-slate-500 text-center">
          © {new Date().getFullYear()} Tooth Aids. For information purposes only. Always consult a professional.
        </p>
      </div>
    </footer>
  );
}
