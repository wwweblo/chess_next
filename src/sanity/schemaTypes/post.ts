import { UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const post = defineType({
    name: 'post',
    title: 'Post',
    type: 'document',
    icon: UserIcon,
    fields: [
        defineField({
            name: 'title',
            type: 'string'
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title'
            }
        }),
        defineField({
            name: 'author',
            type: 'reference',
            to: {type: 'user'}
        }),
        defineField({
            name: 'views',
            type: 'number'
        }),
        defineField({
            name: 'decsription',
            type: 'text'
        }),
        defineField({
            name: 'category',
            type: 'string',
            validation: (Rule) => Rule.min(1).max(20).required().error('Enter a category')
        }),
        defineField({
            name: 'image',
            type: 'url'
        }),
        defineField({
            name: 'pitch',
            type: 'markdown'
        }),
    ],

})