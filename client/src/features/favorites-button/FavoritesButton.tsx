import { Button } from "@chakra-ui/react";
import { MinusIcon, StarIcon } from "@chakra-ui/icons";
import { useTranslation } from "../../shared/translations";
import {
  useAddToFavorites,
  useFavorite,
  useRemoveFromFavorites,
} from "./hooks";

interface Props {
  id: string;
}

export const FavoritesButton: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const { mutate: addToFavorites, isLoading: isAddToFavoritesLoading } =
    useAddToFavorites();
  const {
    mutate: removeFromFavorites,
    isLoading: isRemoveFromFavoritesLoading,
  } = useRemoveFromFavorites();
  const { data: favorite, isLoading } = useFavorite(id);

  const handleClick = () => {
    if (favorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  const loading =
    isLoading || isAddToFavoritesLoading || isRemoveFromFavoritesLoading;

  if (favorite) {
    return (
      <Button
        leftIcon={<MinusIcon />}
        onClick={handleClick}
        isLoading={loading}
      >
        {t("fromFavorites")}
      </Button>
    );
  }

  return (
    <Button leftIcon={<StarIcon />} onClick={handleClick} isLoading={loading}>
      {t("toFavorites")}
    </Button>
  );
};
