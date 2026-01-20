import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function AccordionShowcase() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is wind energy capacity factor?</AccordionTrigger>
        <AccordionContent>
          The capacity factor is the ratio of actual energy output over a period of time
          to the maximum possible output if the turbine operated at rated capacity
          continuously. Typical offshore wind farms achieve 40-50% capacity factors.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How is turbine efficiency calculated?</AccordionTrigger>
        <AccordionContent>
          Turbine efficiency measures how effectively the turbine converts wind energy
          into electrical energy. It's calculated by comparing actual power output to
          the theoretical maximum based on wind speed and rotor area.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What triggers maintenance alerts?</AccordionTrigger>
        <AccordionContent>
          Maintenance alerts are triggered by various conditions including: vibration
          anomalies, temperature deviations, oil quality degradation, unusual power
          fluctuations, and scheduled service intervals based on operating hours.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>How is grid availability measured?</AccordionTrigger>
        <AccordionContent>
          Grid availability represents the percentage of time the grid connection is
          operational and able to accept power from the wind farm. It excludes planned
          maintenance windows and force majeure events.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
