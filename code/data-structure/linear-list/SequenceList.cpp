#include <stdio.h>
#define MAX_SIZE 10

// 定义
typedef struct SequenceList {
    int data[MAX_SIZE];
    int length;
} SequenceList;

// 初始化顺序表
void initList(SequenceList &L) {
    L.length = 0;
}
