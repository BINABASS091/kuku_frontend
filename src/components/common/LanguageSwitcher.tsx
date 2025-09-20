import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  const buttonBg = useColorModeValue('gray.100', 'gray.700');
  const buttonHoverBg = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language]);

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    
    // Update currency based on language
    const newCurrency = languageCode === 'sw' ? 'TZS' : 'USD';
    localStorage.setItem('currency', newCurrency);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Change language"
        variant="ghost"
        bg={buttonBg}
        _hover={{ bg: buttonHoverBg }}
        _active={{ bg: buttonHoverBg }}
        size="sm"
        minW="80px"
        h="36px"
        icon={
          <HStack spacing={2}>
            <Text fontSize="sm">{currentLang.flag}</Text>
            <Text fontSize="xs" fontWeight="medium" display={{ base: 'none', md: 'block' }}>
              {currentLang.code.toUpperCase()}
            </Text>
            <ChevronDownIcon boxSize={3} />
          </HStack>
        }
      />
      <MenuList minW="160px">
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            bg={currentLanguage === language.code ? useColorModeValue('green.50', 'green.900') : undefined}
            color={currentLanguage === language.code ? useColorModeValue('green.700', 'green.200') : undefined}
            fontWeight={currentLanguage === language.code ? 'semibold' : 'normal'}
          >
            <HStack spacing={3}>
              <Text fontSize="sm">{language.flag}</Text>
              <Text fontSize="sm">{language.name}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
