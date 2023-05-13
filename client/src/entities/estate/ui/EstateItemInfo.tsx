import { Flex, Heading, Text, Badge, Tag, Box } from "@chakra-ui/react";
import { Gallery } from "../../../shared/ui";
import { useTranslation } from "../../../shared/translations";
import { EstateItem } from "../hooks";
import { getPriceString } from "../../../shared/getPriceString";
import { getDateString } from "../../../shared/getDateString";

interface Props {
  details: EstateItem;
  isAuthor: boolean;
  action: JSX.Element | null;
}

export const EstateItemInfo: React.FC<Props> = ({
  action,
  details: {
    title,
    address,
    priceUAH,
    rooms,
    livingAreaM2,
    kitchenAreaM2,
    description,
    createdAt,
    images,
  },
}) => {
  const { t } = useTranslation();
  return (
    <Flex gap="8" direction="column">
      {!!images?.length && (
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
        >
          <Box flexGrow="0" overflow="hidden">
            <Gallery images={images} />
          </Box>
          <Box width="200px" flexShrink="0"></Box>
        </Flex>
      )}
      <Flex
        direction="column"
        gap="4"
        alignItems="flex-start"
        pr={{ base: "0", md: "200px" }}
      >
        <Flex
          justifyContent="space-between"
          alignSelf="stretch"
          wrap="wrap"
          gap="2"
        >
          <Heading size="lg">{title}</Heading>
          {action}
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
    </Flex>
  );
};
