export interface StoreItem {
  id: string
  name: string
  price: number
  description: string
}

export const generalStoreItems: StoreItem[] = [
  { id: 'milk',       name: 'Milk (1 gal)',       price: 3.49,  description: 'Whole milk' },
  { id: 'bread',      name: 'Bread',              price: 2.79,  description: 'Whole wheat loaf' },
  { id: 'eggs',       name: 'Eggs (dozen)',        price: 4.99,  description: 'Large eggs' },
  { id: 'produce',    name: 'Produce Bundle',      price: 9.99,  description: 'Weekly fruits & vegetables' },
  { id: 'household',  name: 'Household Supplies',  price: 14.99, description: 'Cleaning & toiletries' },
]

export const clothingStoreItems: StoreItem[] = [
  { id: 'tshirt',     name: 'T-Shirt',        price: 19.99,  description: 'Basic crew neck' },
  { id: 'jeans',      name: 'Jeans',          price: 44.99,  description: 'Classic fit denim' },
  { id: 'sneakers',   name: 'Sneakers',       price: 79.99,  description: 'Casual athletic shoes' },
  { id: 'jacket',     name: 'Winter Jacket',  price: 89.99,  description: 'Insulated parka' },
  { id: 'workoutfit', name: 'Work Outfit',    price: 120.00, description: 'Business casual set' },
]
