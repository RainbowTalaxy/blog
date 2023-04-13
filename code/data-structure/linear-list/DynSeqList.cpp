#include <stdlib.h>
#define INIT_SIZE 10

// 定义
typedef struct DynamicSequenceList {
    int *data;
    int length;
    int maxSize;
} DynamicSequenceList;

// 初始化顺序表
void initList(DynamicSequenceList &L) {
    L.data = (int *)malloc(INIT_SIZE * sizeof(int));
    L.length = 0;
    L.maxSize = INIT_SIZE;
}

// 顺序表扩容
void expandList(DynamicSequenceList &L, int length) {
    int *p = L.data;
    L.data = (int *)malloc((L.maxSize + length) * sizeof(int));
    for (int i = 0; i < L.length; i++) {
        L.data[i] = p[i];
    }
    L.maxSize *= 2;
    free(p);
}