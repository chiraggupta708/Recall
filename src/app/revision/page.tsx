import { RevisionClient } from "@/components/RevisionClient";
import { questionStore } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function RevisionPage() {
  const questions = await questionStore.list();

  return <RevisionClient initialQuestions={questions} />;
}
