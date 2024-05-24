import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { PAGE_SIZE } from "../utils/constans";

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;
const Res = styled.span`
  color: var(--color-brand-500);
  padding: 0.5rem;
  font-size: 2.5rem;
`;
const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
  &:disabled {
    opacity: 0.3;
  }
  & + span,
  & + span + span + span {
    background: var(--color-brand-600);
    color: var(--color-brand-50);
    padding: 0.2rem 0.4rem;
    width: 30px;
    text-align: center;
    border-radius: 4px;
  }
  & + span + span {
    font-size: 1rem;
    padding: 0;
  }
  & + span + span + span {
    background: var(--color-brand-50);
    color: var(--color-brand-600);
    opacity: 0.5;
  }
`;

function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  // calc number of pages
  const pageCount = Math.ceil(count / PAGE_SIZE);
  function handleNextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }
  function handlePreviousPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }
  if (pageCount <= 1) return null;
  return (
    <StyledPagination>
      <P>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1} </span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <Res>{count}</Res> results
      </P>
      <Buttons>
        <PaginationButton
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <HiChevronLeft />
          <span>Prev</span>
        </PaginationButton>

        <span>{currentPage}</span>
        <span>-</span>
        <span>{pageCount}</span>

        <PaginationButton
          onClick={handleNextPage}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

export default Pagination;
