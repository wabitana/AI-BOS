import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';

export default async function WorkflowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // We can load workflow initial data here if it's an existing workflow,
  // but for the visual builder scaffolding, we just render the component.
  
  return (
    <div className="flex-1 w-full relative">
      <WorkflowBuilder />
    </div>
  );
}
