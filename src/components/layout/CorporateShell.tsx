import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ThemedFrame, ThemeProvider } from "@/theme/ThemeProvider";

export default function CorporateShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme="corporate">
      <ThemedFrame className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </ThemedFrame>
    </ThemeProvider>
  );
}
