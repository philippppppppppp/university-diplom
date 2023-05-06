import { Flex, Heading, Text, Badge, Tag, Button } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useTranslation } from "../../../shared/translations";
import { EstateItem } from "../hooks";
import { getPriceString } from "../../../shared/getPriceString";
import { getDateString } from "../../../shared/getDateString";

export const EstateDetails: React.FC<EstateItem> = ({
  title,
  address,
  priceUAH,
  rooms,
  livingAreaM2,
  kitchenAreaM2,
  description,
  createdAt,
}) => {
  const { t } = useTranslation();
  return (
    <Flex direction="column" gap="4" alignItems="flex-start">
      <Flex
        justifyContent="space-between"
        alignSelf="stretch"
        wrap="wrap"
        gap="2"
      >
        <Heading size="lg">{title}</Heading>
        <Button leftIcon={<StarIcon />}>{t("toFavorites")}</Button>
      </Flex>
      <Badge fontSize={20}>{address}</Badge>
      <Heading size="lg">{getPriceString(priceUAH)}</Heading>
      <Flex gap="2" wrap="wrap">
        <Tag>
          {t("rooms")}: {rooms}
        </Tag>
        <Tag>
          {t("totalArea")}: {livingAreaM2 + kitchenAreaM2}м²
        </Tag>
        <Tag>
          {t("livingArea")}: {livingAreaM2}м²
        </Tag>
        <Tag>
          {t("kitchenArea")}: {kitchenAreaM2}м²
        </Tag>
      </Flex>
      <Text>{description}</Text>
      <Tag>
        {t("published")}: {getDateString(createdAt)}
      </Tag>
    </Flex>
  );
};
