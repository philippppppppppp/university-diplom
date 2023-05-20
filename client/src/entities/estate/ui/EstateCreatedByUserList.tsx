import { ChangeEvent, FC, Fragment, useEffect } from "react";
import {
  Flex,
  Select,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Box,
} from "@chakra-ui/react";
import { useEstateCreatedByUserList } from "../hooks";
import { useTranslation } from "../../../shared/translations";
import { Formik, Form, FormikHelpers } from "formik";
import {
  FormInput,
  FormSubmit,
  List,
  Loader,
  LoadingError,
} from "../../../shared/ui";
import { useFilter } from "../../../shared/filtersService";
import { useInView } from "react-intersection-observer";
import { ListItem } from "./components/ListItem";

interface PriceFilter {
  from: string;
  to: string;
}

export const EstateCreatedByUserList: FC = () => {
  const { t } = useTranslation();
  const { ref: loadMoreRef, inView: loadMoreInView } = useInView();

  const [type, setType] = useFilter("type");
  const [rooms, setRooms] = useFilter("rooms");
  const [priceFrom, setPriceFrom] = useFilter("priceFrom");
  const [priceTo, setPriceTo] = useFilter("priceTo");
  const priceInitial: PriceFilter = {
    from: priceFrom,
    to: priceTo,
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useEstateCreatedByUserList({
      type,
      rooms,
      priceFrom: priceFrom,
      priceTo: priceTo,
    });

  useEffect(() => {
    if (loadMoreInView) {
      fetchNextPage();
    }
  }, [loadMoreInView, fetchNextPage]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <LoadingError />;
  }

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setType(value);
  };

  const handleRoomsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRooms(value);
  };

  const handlePriceFilterChange = (
    { from, to }: PriceFilter,
    { setSubmitting }: FormikHelpers<PriceFilter>
  ) => {
    const formattedPrice = {
      from: String(from),
      to: String(to),
    };
    setPriceFrom(formattedPrice.from);
    setPriceTo(formattedPrice.to);
    setSubmitting(false);
  };

  const renderFilters = () => (
    <>
      <Select
        placeholder={t("type")}
        onChange={handleTypeChange}
        value={type}
        flex="150px 1 0"
      >
        <option value="flat">{t("flat")}</option>
        <option value="house">{t("house")}</option>
      </Select>
      <Select
        placeholder={t("rooms")}
        onChange={handleRoomsChange}
        value={rooms}
        flex="150px 1 0"
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4+</option>
      </Select>
      <Popover>
        <PopoverTrigger>
          <Button flex="150px 1 0">{t("price")}</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <Formik
              initialValues={priceInitial}
              onSubmit={handlePriceFilterChange}
            >
              <Form>
                <Flex direction="column" gap="2">
                  <FormInput
                    placeholder={t("from")}
                    type="number"
                    name="from"
                  />
                  <FormInput placeholder={t("to")} type="number" name="to" />
                  <FormSubmit>{t("apply")}</FormSubmit>
                </Flex>
              </Form>
            </Formik>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );

  return (
    <List renderFilters={renderFilters}>
      {data?.pages.map(({ data, nextOffset }) => (
        <Fragment key={nextOffset}>
          {data.map((item) => (
            <ListItem {...item} key={item.id} />
          ))}
        </Fragment>
      ))}
      {!isLoading && hasNextPage && (
        <Box ref={loadMoreRef}>
          <Loader />
        </Box>
      )}
    </List>
  );
};
