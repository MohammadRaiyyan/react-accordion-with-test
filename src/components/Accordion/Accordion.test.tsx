import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Accordion from '.'

const getSectionHeader = (text: string) => screen.getByText(text)
const getSectionBody = (text: string) => screen.queryByText(text)

const AccordionExample = ({defaultOpen,alwaysOpen}:{defaultOpen?:string,alwaysOpen?:boolean})=>{
    return(
        <Accordion.Root defaultActiveKey={defaultOpen} alwaysOpen={alwaysOpen}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Section 1</Accordion.Header>
                <Accordion.Body>Content 1</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Section 2</Accordion.Header>
                <Accordion.Body>Content 2</Accordion.Body>
            </Accordion.Item>
        </Accordion.Root>
    )
}

describe('Accordion component', () => {
    it("should render the Accordion component with items", () => {
        render(<AccordionExample />)
        expect(getSectionHeader('Section 1')).toBeInTheDocument()
        expect(getSectionHeader('Section 2')).toBeInTheDocument()
    })

    it("should render the Accordion component with default open section", () => {
        render(<AccordionExample defaultOpen="0" />)
        expect(getSectionBody('Content 1')).toBeVisible()
        expect(getSectionBody('Content 2')).not.toBeInTheDocument()
    })
    it("should close the default open section on click", async () => {
        render(<AccordionExample defaultOpen="0" />)
        const section1Header = getSectionHeader('Section 1')
        await userEvent.click(section1Header)
        expect(getSectionBody('Content 1')).not.toBeInTheDocument()
    })
    it("should close the default open section on click of second section and should open section 2", async () => {
        render(<AccordionExample defaultOpen="0" />)
        const section2Header = getSectionHeader('Section 2')
        await userEvent.click(section2Header)
        expect(getSectionBody('Content 1')).not.toBeInTheDocument()
        expect(getSectionBody('Content 2')).toBeVisible()
    })
    it("should render the Accordion component's  item on click and close others if open", async () => {
        render(<AccordionExample />)
        const section1Header = getSectionHeader('Section 1')
        await userEvent.click(section1Header)
        expect(getSectionBody('Content 1')).toBeVisible()
        expect(getSectionBody('Content 2')).not.toBeInTheDocument()
        const section2Header = getSectionHeader('Section 2')
        await userEvent.click(section2Header)
        expect(getSectionBody('Content 2')).toBeVisible()
        expect(getSectionBody('Content 1')).not.toBeInTheDocument()
    })
    it("should render the Accordion component with alwaysOpen prop and on click each section all the sections should be visible", async () => {
        render(<AccordionExample alwaysOpen={true} />)
        const section1Header = getSectionHeader('Section 1')
        const section2Header = getSectionHeader('Section 2')
        await userEvent.click(section1Header)
        await userEvent.click(section2Header)
        expect(getSectionBody('Content 1')).toBeVisible()
        expect(getSectionBody('Content 2')).toBeVisible()
    })
    it("should render nothing if no children are passed", () => {
        render(<Accordion.Root children={null}/>)
        expect(getSectionBody('Section 1')).not.toBeInTheDocument()
        expect(getSectionBody('Section 2')).not.toBeInTheDocument()
    })
    it("should not crash if an invalid defaultActiveKey is provided", () => {
        render(<AccordionExample defaultOpen="invalid-key" />)
        expect(getSectionBody('Content 1')).not.toBeInTheDocument()
        expect(getSectionBody('Content 2')).not.toBeInTheDocument()
    })
    it("should toggle all items with the same eventKey when one is clicked", async () => {
        render(
            <Accordion.Root>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Section 1</Accordion.Header>
                    <Accordion.Body>Content 1</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Section 1 Duplicate</Accordion.Header>
                    <Accordion.Body>Content 1 Duplicate</Accordion.Body>
                </Accordion.Item>
            </Accordion.Root>
        )
        expect(getSectionHeader('Section 1')).toBeInTheDocument()
        expect(getSectionHeader('Section 1 Duplicate')).toBeInTheDocument()
        const section1Header = getSectionHeader('Section 1')
        const section1DuplicateHeader = getSectionHeader('Section 1 Duplicate')
        await userEvent.click(section1Header)
        expect(getSectionBody('Content 1')).toBeVisible()
        expect(getSectionBody('Content 1 Duplicate')).toBeVisible()
        await userEvent.click(section1DuplicateHeader)
        expect(getSectionBody('Content 1 Duplicate')).not.toBeInTheDocument()
        expect(getSectionBody('Content 1')).not.toBeInTheDocument()
    })
    it("should allow keyboard arrow navigation between headers", async () => {
        render(<AccordionExample />)
        const section1Header = getSectionHeader('Section 1')
        const section2Header = getSectionHeader('Section 2')

        section1Header.focus()
        expect(document.activeElement).toBe(section1Header)

        await userEvent.keyboard('{ArrowDown}')
        expect(document.activeElement).toBe(section2Header)

        await userEvent.keyboard('{ArrowUp}')
        expect(document.activeElement).toBe(section1Header)
    })
})