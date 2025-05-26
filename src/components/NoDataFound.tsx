import { Link } from "react-router-dom";
import noDataFoundDarkImg from "@/assets/no-data-found.svg";
import { Button } from "@chakra-ui/react";

export const NoDataFound = ({
  title = "data",
  routeLink,
}: {
  title?: string;
  routeLink?: string;
}) => {
  return (
    <div
      style={{ marginTop: "-5%" }}
      className="h-full w-full flex flex-col justify-center items-center p-4"
    >
      <img
        className="block opacity-90"
        src={noDataFoundDarkImg}
        alt="no-data-found"
      />
      <h3 className="text-xl font-bold tracked-tight dark:opacity-90">
        No {title} found
      </h3>
      <p className="text-muted-foreground text-center my-1">
        Add {title} to view insights.
      </p>
      {!!routeLink && (
        <Link to={routeLink}>
          <Button variant={"solid"} color="bg.default">Create {title}</Button>
        </Link>
      )}
    </div>
  );
};
