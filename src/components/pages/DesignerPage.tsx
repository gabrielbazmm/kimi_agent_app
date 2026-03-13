import { useBoxConfig } from '@/hooks';
import { DesignerHeader, DesignerViewport, DesignerSidebar } from '@/components/designer';

export function DesignerPage() {
  const { config, setConfig, resetConfig } = useBoxConfig();

  return (
    <div className="min-h-screen bg-neutral-50">
      <DesignerHeader config={config} onReset={resetConfig} />

      <main className="pt-16 h-screen flex">
        <DesignerViewport config={config} />
        <DesignerSidebar config={config} setConfig={setConfig} />
      </main>
    </div>
  );
}
