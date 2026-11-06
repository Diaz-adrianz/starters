import { Card, CardContent } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/features/identity';

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
