import { useNavigate } from "react-router-dom";
import { CreateEstateForm } from "../../entities/estate";
import { BasicLayout } from "../../widgets/basic-layout";

export const CreateEstatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (id: string) => {
    navigate(`/estate/${id}`);
  };

  return (
    <BasicLayout>
      <CreateEstateForm onSuccess={handleSuccess} />
    </BasicLayout>
  );
};
