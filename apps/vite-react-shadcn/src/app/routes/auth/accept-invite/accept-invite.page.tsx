import { Card, CardContent } from '@/components/ui/card';
import { AcceptInviteForm } from '@/features/identity';

const AcceptInvitePage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <AcceptInviteForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitePage;
