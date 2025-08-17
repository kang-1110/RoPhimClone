import { Button, Card, Image, Typography } from "antd";
import { FiExternalLink } from "react-icons/fi";

const DashboardManagement = () => {
  return (
    <div className="flex justify-center items-center flex-1">
        <Card className="shadow-2xl p-8 rounded-lg">
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/images/logo-dashboard.png"
              preview={false}
            />
            <Typography.Text className="text-center text-lg">
              Analytics data is now tracked via Google Analytics. 
              <br />
              Click below to view your report.
            </Typography.Text>
            <Button
              icon={<FiExternalLink />}
              iconPosition="end"
              type="primary"
            >
              Move to Google Analytics
            </Button>
          </div>
        </Card>
    </div>
  );
};

export default DashboardManagement;
