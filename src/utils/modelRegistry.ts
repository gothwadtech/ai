import { safeStorage } from "./safeStorage";
import { AIModel, DEFAULT_MODELS } from "./modelsConfig";

export type { AIModel };

export function getAppModels(): AIModel[] {
  let baseList = DEFAULT_MODELS;
  const savedV1 = safeStorage.getItem("gothwad_ai_custom_models_v1");
  if (savedV1) {
    try {
      const parsed = JSON.parse(savedV1);
      if (Array.isArray(parsed) && parsed.length > 0) {
        baseList = parsed;
      }
    } catch (e) {
      console.error("Failed to parse custom models list", e);
    }
  }

  // Merge gothwad_custom_models (auto-fetched or registered models)
  const savedGothwadCustom = safeStorage.getItem("gothwad_custom_models");
  if (savedGothwadCustom) {
    try {
      const parsedCustom = JSON.parse(savedGothwadCustom);
      if (Array.isArray(parsedCustom)) {
        const existingValues = new Set(baseList.map(m => m.value));
        const extraItems: AIModel[] = [];

        parsedCustom.forEach((cm: any) => {
          if (!existingValues.has(cm.id)) {
            extraItems.push({
              value: cm.id,
              label: `${cm.name} (${cm.tag || "Auto"})`,
              desc: cm.desc || "Auto-fetched custom AI engine",
              categories: ["chats", "software"]
            });
            existingValues.add(cm.id);
          }
        });

        if (extraItems.length > 0) {
          baseList = [...baseList, ...extraItems];
        }
      }
    } catch (e) {}
  }

  return baseList;
}

export function saveAppModels(models: AIModel[]) {
  safeStorage.setItem("gothwad_ai_custom_models_v1", JSON.stringify(models));
}
