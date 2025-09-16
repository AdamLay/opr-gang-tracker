import { createCampaignAction } from "@/app/campaigns/actions";
import { redirect } from "next/navigation";

export default function CreateCampaignFormServer() {
  async function createCampaign(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    if (!name?.trim()) {
      throw new Error("Campaign name is required");
    }

    const result = await createCampaignAction({ name });

    if (!result.success) {
      throw new Error(result.error || "Failed to create campaign");
    }

    redirect("/campaigns");
  }

  return (
    <form action={createCampaign} className="space-y-4">
      <div className="form-control">
        <label htmlFor="name" className="label">
          <span className="label-text">Campaign Name</span>
        </label>
        <input type="text" id="name" name="name" required className="input input-bordered w-full" />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Create Campaign
      </button>
    </form>
  );
}
