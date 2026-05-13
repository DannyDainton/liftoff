import artemisModule from "@/content/modules/artemis-mission-control/module.json";
import apiBasicsModule from "@/content/modules/api-basics/module.json";
import bankingModule from "@/content/modules/banking-ai-mcp-bootcamp/module.json";
import { Module, Lesson } from "@/types/module";

const modules: Module[] = [artemisModule as Module, apiBasicsModule as Module, bankingModule as Module];

export function getAllModules(): Module[] {
  return modules;
}

export function getModule(moduleId?: string): Module {
  if (moduleId) {
    return modules.find((m) => m.id === moduleId) || modules[0];
  }
  return modules[0];
}

export function getLesson(slug: string, moduleId?: string): Lesson | undefined {
  const mod = getModule(moduleId);
  return mod.lessons.find((l) => l.slug === slug);
}

export function getAllLessonSlugs(): string[] {
  return modules.flatMap((m) => m.lessons.map((l) => l.slug));
}
