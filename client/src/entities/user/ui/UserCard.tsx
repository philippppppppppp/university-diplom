import {
  Flex,
  Heading,
  Text,
  Box,
  Avatar,
  Card,
  CardHeader,
  CardBody,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "../../../shared/translations";
import { getDateString } from "../../../shared/getDateString";
import { getPhoneString } from "../../../shared/getPhoneString";
import { User } from "../hooks";

export const UserCard: React.FC<{ user: User }> = ({
  user: { name, lastOnline, phone },
}) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <Heading size="md">{t("contantWith")}</Heading>
      </CardHeader>
      <CardBody>
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap="4"
        >
          <Flex gap="4" alignItems="center">
            <Avatar name={name} />
            <Box>
              <Heading size="sm">{name}</Heading>
              {!!lastOnline && (
                <Text>
                  {t("lastOnline")} {getDateString(lastOnline)}
                </Text>
              )}
            </Box>
          </Flex>
          <Button as="a" href={`tel:+38${phone}`}>
            {getPhoneString(phone)}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};
