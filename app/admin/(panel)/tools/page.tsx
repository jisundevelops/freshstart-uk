import { getToolConfigs } from "@/actions/admin/tools";
import { saveToolConfig } from "@/actions/admin/tools";
import { JsonConfigEditor } from "@/components/admin/json-config-editor";
import { getAdminContext } from "@/lib/admin/session";
import { BANK_CONFIGS } from "@/lib/tools/bank-compare";
import { SIM_CONFIGS } from "@/lib/tools/sim-guide";
import { COST_CITIES } from "@/lib/tools/cost-calculator";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tools Config" };

export default async function AdminToolsPage() {
  const { canWrite } = await getAdminContext();
  const result = await getToolConfigs();
  const configs = result.success
    ? result.data
    : {
        bank: BANK_CONFIGS,
        sim: SIM_CONFIGS,
        cost: { cities: COST_CITIES, rentBase: { shared: 550, private: 750, studio: 950 } },
      };

  return (
    <div className="space-y-8">
      <h1 className="gradient-heading font-heading text-3xl font-bold">
        Tools configuration
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        JSON editors for comparison tables and calculator pricing. Invalid JSON
        is rejected on save.
      </p>

      {canWrite ? (
        <div className="space-y-8">
          <JsonConfigEditor
            title="Bank comparison"
            description="Barclays, HSBC, Monzo, Starling, Wise row definitions."
            initialJson={JSON.stringify(configs.bank, null, 2)}
            previewHref="/tools/bank-compare"
            onSave={async (parsed) => {
              const r = await saveToolConfig("bank", parsed);
              return { success: r.success, error: r.success ? undefined : r.error };
            }}
          />
          <JsonConfigEditor
            title="SIM guide"
            description="Mobile provider comparison fields."
            initialJson={JSON.stringify(configs.sim, null, 2)}
            previewHref="/tools/sim-guide"
            onSave={async (parsed) => {
              const r = await saveToolConfig("sim", parsed);
              return { success: r.success, error: r.success ? undefined : r.error };
            }}
          />
          <JsonConfigEditor
            title="Cost calculator"
            description="City multipliers and rent base values."
            initialJson={JSON.stringify(configs.cost, null, 2)}
            previewHref="/tools/cost-calculator"
            onSave={async (parsed) => {
              const r = await saveToolConfig("cost", parsed);
              return { success: r.success, error: r.success ? undefined : r.error };
            }}
          />
        </div>
      ) : (
        <p className="text-sm text-muted">View-only access.</p>
      )}
    </div>
  );
}
