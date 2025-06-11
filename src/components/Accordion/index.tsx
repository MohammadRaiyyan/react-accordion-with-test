import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
  
  interface AccordionContextType {
    accordionItemKey: Array<string>;
    onToggle: (key: string) => void;
  }
  const AccordionContext = createContext<AccordionContextType | undefined>(
    undefined
  );
  
  function useAccordionContext() {
    const context = useContext(AccordionContext);
  
    if (!context) {
      throw new Error(
        "useAccordionContext must be called in the Accordion context provider!"
      );
    }
  
    return context;
  }
  
  interface RootProps {
    defaultActiveKey?: string | Array<string>;
    alwaysOpen?: boolean;
    children: ReactNode;
  }
  function Root(props: RootProps) {
    const narrowedProps = useMemo(() => {
      if (Array.isArray(props.defaultActiveKey)) {
        return props.defaultActiveKey;
      }
      if (typeof props.defaultActiveKey === "string") {
        return [props.defaultActiveKey];
      }
      return [];
    }, [props.defaultActiveKey]);
  
    const [accordionItemKey, setAccordionItemKeyKey] =
      useState<Array<string>>(narrowedProps);
  
    const onToggle = useCallback(
      (key: string) => {
        setAccordionItemKeyKey((prev) => {
          if (prev.includes(key)) {
            return prev.filter((k) => k !== key);
          }
          if (props.alwaysOpen) {
            return [...prev, key];
          }
          return [key];
        });
      },
      [props.alwaysOpen]
    );
    const value = useMemo(() => {
      return {
        accordionItemKey,
        onToggle,
      };
    }, [accordionItemKey, onToggle]);
    return (
      <AccordionContext.Provider value={value}>
        <div className="accordion-container">{props.children}</div>
      </AccordionContext.Provider>
    );
  }
  const ItemContext = createContext<
    { eventKey: string; isOpen: boolean } | undefined
  >(undefined);
  function useItemContext() {
    const context = useContext(ItemContext);
    if (!context) {
      throw new Error("useItemContext must be used inside item context");
    }
    return context;
  }
  interface ItemType {
    eventKey: string;
    children: ReactNode;
  }
  function Item(props: ItemType) {
    const { accordionItemKey } = useAccordionContext();
    const isOpen = useMemo(() => {
      return accordionItemKey.includes(props.eventKey);
    }, [accordionItemKey, props.eventKey]);
  
    const value = useMemo(() => {
      return {
        eventKey: props.eventKey,
        isOpen,
      };
    }, [props.eventKey, isOpen]);
    return (
      <ItemContext.Provider value={value}>
        <div className="accordion-item-container">{props.children}</div>
      </ItemContext.Provider>
    );
  }
  interface HeaderType {
    children: ReactNode;
  }
  function Header(props: HeaderType) {
    const { onToggle } = useAccordionContext();
    const { eventKey, isOpen } = useItemContext();

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      const headers = document.querySelectorAll('.accordion-item__header');
      if (!headers.length) return;
      const currentIndex = Array.from(headers).indexOf(e.currentTarget);
      if (e.key === 'ArrowDown') {
        const next = headers[(currentIndex + 1) % headers.length] as HTMLElement;
        next.focus();
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        const prev = headers[(currentIndex - 1 + headers.length) % headers.length] as HTMLElement;
        prev.focus();
        e.preventDefault();
      }
    }

    return (
      <button
        onClick={() => onToggle(eventKey)}
        onKeyDown={handleKeyDown}
        className="accordion-item__header"
        aria-expanded={isOpen}
        aria-controls={`accordion-body-${eventKey}`}
        type="button"
        role="tab"
        aria-selected={isOpen}
        tabIndex={0}
      >
        {props.children}
      </button>
    );
  }
  interface BodyType {
    children: ReactNode;
  }
  function Body(props: BodyType) {
    const { isOpen, eventKey } = useItemContext();
    if (!isOpen) return null;
    return (
      <div
        id={`accordion-body-${eventKey}`}
        role="region"
        className={"accordion-item__body"}
      >
        {props.children}
      </div>
    );
  }
  
  const Accordion = {
    Root,
    Item,
    Header,
    Body,
  };
  export default Accordion;
