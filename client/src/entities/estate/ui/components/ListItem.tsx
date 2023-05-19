import {
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  Text,
  Image,
  CardFooter,
  Tag,
} from "@chakra-ui/react";
import { EstateListItem } from "../../hooks";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../../shared/translations";
import { getPriceString } from "../../../../shared/getPriceString";
import { getDateString } from "../../../../shared/getDateString";

export const ListItem: React.FC<EstateListItem> = ({
  id,
  images,
  title,
  description,
  address,
  priceUAH,
  createdAt,
  livingAreaM2,
  rooms,
}) => {
  const { t } = useTranslation();
  return (
    <Card
      direction={{ md: "row", base: "column" }}
      cursor="pointer"
      as={Link}
      to={`/estate/${id}`}
      overflow="hidden"
    >
      <Image
        maxW={{ md: "400px", base: "100%" }}
        maxH={{ md: "auto", base: "350px" }}
        objectFit="cover"
        src={images?.[0]}
      />
      <Stack>
        <CardBody>
          <Text pb="1">{getPriceString(priceUAH)}</Text>
          <Heading size="md">{title}</Heading>
          <Text py="2">{address}</Text>
          {!!description && <Text py="2">{description}</Text>}
          <Flex py="2" gap="2">
            <Tag>
              {t("rooms")}: {rooms}
            </Tag>
            <Tag>
              {t("totalArea")}: {livingAreaM2}м²
            </Tag>
          </Flex>
        </CardBody>
        <CardFooter>
          <Text>
            {t("published")}: {getDateString(createdAt)}
          </Text>
        </CardFooter>
      </Stack>
    </Card>
  );
};
