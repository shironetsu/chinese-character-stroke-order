import { useEffect, useState } from "react";
import useWasm from "../lib/useWasm";
import {
  Box,
  Container,
  Flex,
  VStack,
  Button,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  ButtonGroup,
  Center,
  Heading,
  Icon,
  Link,
  HStack,
  Spacer,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { Preset, beijing2008, beijing2022 } from "../lib/presets";
import { notices } from "../lib/notices";
import AutoResizeTextarea from "../components/AutoResizeTextarea";
import { FaTwitter, FaGithub } from "react-icons/fa";

type TextInputs = {
  firstCountries: string;
  otherCountries: string;
  lastCountries: string;
};

function convertPreset(preset: Preset): TextInputs {
  return {
    firstCountries: preset.firstCountries.join("\n"),
    otherCountries: preset.otherCountries.join("\n"),
    lastCountries: preset.lastCountries.join("\n"),
  };
}

export default function App() {
  const [textInputs, setTextInputs] = useState<TextInputs>(
    convertPreset(beijing2022)
  );
  const [selectedPreset, setSelectedPreset] = useState<
    "2008" | "2022" | undefined
  >("2022");
  const setPartialTextInputs = (partialTextInputs: Partial<TextInputs>) => {
    setTextInputs((prev) => ({
      ...prev,
      ...partialTextInputs,
    }));
  };
  const [sortedCountries, setSortedCountries] = useState<string[]>([]);
  const [ignoredStrings, setIgnoredStrings] = useState<string[]>([]);
  const [isSorted, setIsSorted] = useState(false);

  const wasm = useWasm();

  const sort = () => {
    const a = textInputs.otherCountries
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    if (wasm.loaded && wasm.ok) {
      const sortResult = wasm.sortByStroke(a);
      setSortedCountries([
        ...textInputs.firstCountries.split("\n").filter((s) => s !== ""),
        ...sortResult.sorted,
        ...textInputs.lastCountries.split("\n").filter((s) => s !== ""),
      ]);
      setIgnoredStrings(sortResult.ignored);
      setIsSorted(true);
    }
  };

  const setPreset = (year: "2008" | "2022") => {
    const preset = (() => {
      switch (year) {
        case "2008":
          return beijing2008;
        case "2022":
          return beijing2022;
      }
    })();
    setSelectedPreset(year);
    setTextInputs(convertPreset(preset));
    if (wasm.loaded && wasm.ok) {
      const sortResult = wasm.sortByStroke(preset.otherCountries);
      setSortedCountries([
        ...preset.firstCountries,
        ...sortResult.sorted,
        ...preset.lastCountries,
      ]);
      setIgnoredStrings([]);
      setIsSorted(true);
    }
  };

  useEffect(() => {
    if (wasm.loaded) {
      if (wasm.ok) {
        sort();
      } else {
        alert("????????????????????????????????????");
      }
    }
  }, [wasm.loaded]);

  const handleTextInput = (key: keyof TextInputs, value: string) => {
    setSelectedPreset(undefined);
    setPartialTextInputs({
      [key]: value,
    });
    setIsSorted(false);
  };

  return (
    <Container maxWidth={"container.xl"}>
      <VStack width="full" p={4}>
        <Heading>???????????????????????????????????????????????????</Heading>
        <HStack>
          <Link href="https://twitter.com/shironetsu" target={"_blank"}>
            <Icon as={FaTwitter} boxSize={6} />
          </Link>
          <Spacer />
          <Link
            href="https://github.com/shironetsu/chinese-character-stroke-order"
            target={"_blank"}
          >
            <Icon as={FaGithub} boxSize={6} />
          </Link>
        </HStack>

        <Text>
          ??????????????????<span lang="zh-cn">????????????</span>
          ??????????????????????????????????????????
        </Text>
        <ButtonGroup>
          <Button
            onClick={() => setPreset("2008")}
            isActive={selectedPreset == "2008"}
          >
            2008???
          </Button>
          <Button
            onClick={() => setPreset("2022")}
            isActive={selectedPreset == "2022"}
          >
            2022???
          </Button>
          <Button onClick={sort}>????????????</Button>
        </ButtonGroup>
        <Flex w="full" h="full" alignItems={"flex-start"}>
          <Box p={2} h="full" alignItems={"center"} flex={1}>
            <Flex flexFlow="column">
              <Text>??????????????????</Text>
              <AutoResizeTextarea
                lang="zh-cn"
                value={textInputs.firstCountries}
                onChange={({ target: { value } }) =>
                  handleTextInput("firstCountries", value)
                }
              />
              <Text>??????????????????</Text>
              <AutoResizeTextarea
                lang="zh-cn"
                value={textInputs.lastCountries}
                onChange={({ target: { value } }) =>
                  handleTextInput("lastCountries", value)
                }
              />
              <Text>??????????????????</Text>
              <AutoResizeTextarea
                lang="zh-cn"
                value={textInputs.otherCountries}
                onChange={({ target: { value } }) =>
                  handleTextInput("otherCountries", value)
                }
              />
            </Flex>
          </Box>
          <Box
            p={2}
            h="full"
            flex={1}
            overflowX={"scroll"}
            style={{ filter: isSorted ? undefined : "blur(2px)" }}
          >
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>
                      <Center>??????</Center>
                    </Th>
                    <Th>??????</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedCountries.map((name, i) => {
                    const notice = notices.get(name);
                    return (
                      <Tr key={i}>
                        <Td p={0.5}>
                          <Center>{i + 1}</Center>
                        </Td>
                        <Td p={0.5}>
                          {notice ? (
                            <Accordion allowToggle>
                              <AccordionItem border="none">
                                <AccordionButton p={0}>
                                  <WarningIcon />
                                  <span lang="zh-cn">{name}</span>
                                  <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel p={4} maxW="full" overflow={'scroll'}>
                                    {notice}
                                </AccordionPanel>
                              </AccordionItem>
                            </Accordion>
                          ) : (
                            <span lang="zh-cn">{name}</span>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                  {ignoredStrings.map((name, i) => {
                    return (
                      <Tr key={i}>
                        <Td p={0.5}>
                          <Center>???</Center>
                        </Td>
                        <Td p={0.5}>
                          <span lang="zh-cn">{name}</span>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
}
