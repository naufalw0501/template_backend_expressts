interface FormAddProductInterface {
    product_name : string
    description : string
    id_category : number 
    lowest_price : number
    highest_price : number
    size : string
    notes : string
    link_shopee : string
    link_tokopedia : string  
    image_file : string 
}

interface FormUpdateProductInterface {
    id : number
    product_name? : string
    description? : string
    id_category? : number 
    lowest_price? : number
    highest_price? : number
    size? : string
    notes? : string
    link_shopee? : string
    link_tokopedia? : string  
    image_file? : string 
}

export { FormAddProductInterface, FormUpdateProductInterface }