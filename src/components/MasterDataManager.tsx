import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Text,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import api from '../services/api';

export type ColumnConfig<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

export type FieldConfig =
  | { type: 'text'; name: string; label: string; required?: boolean; placeholder?: string }
  | { type: 'textarea'; name: string; label: string; required?: boolean; placeholder?: string }
  | { type: 'select'; name: string; label: string; required?: boolean; options: { label: string; value: string | number }[] };

type MasterDataManagerProps<T extends { id: number }> = {
  title: string;
  endpoint: string; // e.g. 'breed-types/'
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  normalizeOut?: (payload: any) => Partial<T>; // when editing existing item to form values
  normalizeIn?: (formValues: Record<string, any>) => any; // before send to API
};

function MasterDataManager<T extends { id: number }>({ title, endpoint, columns, fields, normalizeOut, normalizeIn }: MasterDataManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const resetForm = () => setFormValues({});

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(endpoint);
      const data = res.data.results || res.data;
      setItems(data);
      setFilteredItems(data);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Failed to fetch data.';
      setError(msg);
      toast({ title: 'Error', description: msg, status: 'error', duration: 4000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = items.filter((it) => JSON.stringify(it).toLowerCase().includes(term));
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const openCreate = () => {
    setSelectedItem(null);
    resetForm();
    onOpen();
  };

  const openEdit = (row: T) => {
    setSelectedItem(row);
    const initial = normalizeOut ? normalizeOut(row) : row;
    setFormValues(initial as Record<string, any>);
    onOpen();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = normalizeIn ? normalizeIn(formValues) : formValues;
      if (selectedItem) {
        await api.put(`${endpoint}${selectedItem.id}/`, payload);
        toast({ title: 'Updated', description: `${title} updated successfully`, status: 'success', duration: 3000, isClosable: true });
      } else {
        await api.post(endpoint, payload);
        toast({ title: 'Created', description: `${title} created successfully`, status: 'success', duration: 3000, isClosable: true });
      }
      onClose();
      resetForm();
      fetchItems();
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.detail || 'Failed to save', status: 'error', duration: 5000, isClosable: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (row: T) => {
    try {
      await api.delete(`${endpoint}${row.id}/`);
      toast({ title: 'Deleted', description: `${title} deleted successfully`, status: 'success', duration: 3000, isClosable: true });
      fetchItems();
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to delete', status: 'error', duration: 5000, isClosable: true });
    }
  };

  const renderField = (field: FieldConfig) => {
    const val = formValues[field.name] ?? '';
    const setVal = (v: any) => setFormValues((prev) => ({ ...prev, [field.name]: v }));

    switch (field.type) {
      case 'textarea':
        return (
          <FormControl key={field.name} isRequired={field.required}>
            <FormLabel>{field.label}</FormLabel>
            <Textarea value={val} onChange={(e) => setVal(e.target.value)} placeholder={field.placeholder} />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={field.name} isRequired={field.required}>
            <FormLabel>{field.label}</FormLabel>
            <Select value={val} onChange={(e) => setVal(e.target.value)}>
              {field.options.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return (
          <FormControl key={field.name} isRequired={field.required}>
            <FormLabel>{field.label}</FormLabel>
            <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder={field.placeholder} />
          </FormControl>
        );
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="300px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box w="100%">
      <VStack spacing={6} align="stretch" w="100%">
        <HStack justify="space-between">
          <Heading size="lg">{title}</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={openCreate}>Add</Button>
        </HStack>

        <Card bg={cardBg} borderColor={borderColor} w="100%">
          <CardBody>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input placeholder={`Search ${title.toLowerCase()}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </InputGroup>
          </CardBody>
        </Card>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Card bg={cardBg} borderColor={borderColor} w="100%" minH={{ base: '50vh', md: '60vh' }} overflow="hidden">
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">{title} ({filteredItems.length})</Text>
          </CardHeader>
          <CardBody p={0}>
            <Box overflowX="auto">
            <Table variant="simple" w="100%" size="md">
              <Thead>
                <Tr>
                  {columns.map((col) => (
                    <Th key={String(col.key)}>{col.header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems.map((row) => (
                  <Tr key={row.id}>
                    {columns.map((col) => (
                      <Td key={`${row.id}-${String(col.key)}`}>
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </Td>
                    ))}
                    <Td whiteSpace="nowrap">
                      <HStack spacing={2}>
                        <IconButton aria-label="View" icon={<ViewIcon />} size="sm" variant="ghost" onClick={() => openEdit(row)} />
                        <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" variant="ghost" colorScheme="blue" onClick={() => openEdit(row)} />
                        <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={() => remove(row)} />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            </Box>
          </CardBody>
        </Card>

        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedItem ? `Edit ${title}` : `Create ${title}`}</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={save}>
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  {fields.map(renderField)}
                </VStack>
              </ModalBody>
              <Box p={6} pt={0}>
                <HStack justify="flex-end">
                  <Button variant="ghost" onClick={onClose}>Cancel</Button>
                  <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>Save</Button>
                </HStack>
              </Box>
            </form>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}

export default MasterDataManager;


