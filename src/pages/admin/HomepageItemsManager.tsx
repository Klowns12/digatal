import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Heading, Box, Text, Alert, Grid, Card, useToast } from '@chakra-ui/react';

// Import from your existing services
import { serviceCategories } from '../../data/serviceCategories';

const HomepageItemsManager = () => {
  const toast = useToast();
  const [categories, setCategories] = useState(serviceCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Count selected items per category
  const getSelectedCount = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return 0;
    return category.items.filter(item => item.isOnHomepage).length;
  };

  // Handle item selection/deselection
  const toggleItemSelection = (categoryId, itemId) => {
    setCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.id !== categoryId) return category;
        
        const selectedCount = getSelectedCount(categoryId);
        const item = category.items.find(i => i.id === itemId);
        
        // If trying to select but already have 4 selected, prevent selection
        if (!item.isOnHomepage && selectedCount >= 4) {
          toast({
            title: "เกินจำนวนที่กำหนด",
            description: "คุณสามารถเลือกได้ไม่เกิน 4 รายการต่อหมวดหมู่",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          return category;
        }
        
        // Toggle the selection
        return {
          ...category,
          items: category.items.map(i => 
            i.id === itemId 
              ? { ...i, isOnHomepage: !i.isOnHomepage } 
              : i
          )
        };
      });
    });
  };

  // Save changes to backend
  const saveChanges = async () => {
    setIsSubmitting(true);
    try {
      // Here you'd call your API to save the selections
      // Example:
      // await api.saveHomepageSelections(categories.map(category => ({
      //   categoryId: category.id,
      //   itemIds: category.items.filter(item => item.isOnHomepage).map(item => item.id)
      // })));
      
      // For now, we'll simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "บันทึกสำเร็จ",
        description: "การเลือกรายการสำหรับหน้าหลักถูกบันทึกแล้ว",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการเลือกรายการได้",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error saving homepage selections:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>จัดการรายการที่แสดงในหน้าหลัก</Heading>
      <Text mb={4}>เลือกรายการที่ต้องการให้แสดงในหน้าหลัก (สูงสุด 4 รายการต่อหมวดหมู่)</Text>
      
      {categories.map(category => (
        <Box key={category.id} mb={8} p={4} borderWidth="1px" borderRadius="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Heading size="md">{category.title} ({category.titleThai})</Heading>
            <Text>
              เลือกแล้ว: {getSelectedCount(category.id)}/4
            </Text>
          </Box>
          
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
            {category.items.map(item => (
              <Card key={item.id} p={3} shadow="sm">
                <Box display="flex" alignItems="center">
                  <Checkbox 
                    isChecked={item.isOnHomepage || false}
                    onChange={() => toggleItemSelection(category.id, item.id)}
                    colorScheme="blue"
                    mr={3}
                  />
                  <Box>
                    <Text fontWeight="medium">{item.title}</Text>
                    <Text fontSize="sm" color="gray.600">
                      ราคา: ฿{item.price.toFixed(2)}
                    </Text>
                  </Box>
                </Box>
              </Card>
            ))}
          </Grid>
        </Box>
      ))}
      
      <Box mt={6} display="flex" justifyContent="flex-end">
        <Button 
          colorScheme="blue" 
          size="lg"
          onClick={saveChanges}
          isLoading={isSubmitting}
        >
          บันทึกการเปลี่ยนแปลง
        </Button>
      </Box>
    </Box>
  );
};

export default HomepageItemsManager;
