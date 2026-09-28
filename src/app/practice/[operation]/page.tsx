import { PracticeSuite } from '@/components/practice/PracticeSuite';
import { OperationType } from '@/lib/math/question-generator';

export default function PracticeOperationPage({
  params,
}: {
  params: { operation: string };
}) {
  const normalizedOp = params.operation.toUpperCase() as OperationType;
  return <PracticeSuite initialOperation={normalizedOp || 'ADDITION'} />;
}
