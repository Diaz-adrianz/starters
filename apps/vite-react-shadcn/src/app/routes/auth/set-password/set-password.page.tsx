import { Card, CardContent } from '@/components/ui/card';
import { SetPasswordForm } from '@/features/identity';

const SetPasswordPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <SetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPasswordPage;
